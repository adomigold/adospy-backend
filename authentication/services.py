import datetime
from authentication.models import Contacts, SMSMessages


def save_messages(messages, target):
    # Get all message_ids already saved for the target
    existing_ids = set(
        SMSMessages.objects.filter(
            target=target,
            message_id__in=[msg["id"] for msg in messages]
        ).values_list("message_id", flat=True)
    )

    # Filter out messages that are already saved
    new_messages = [
        SMSMessages(
            target=target,
            message_id=msg["id"],
            address=msg["address"],
            message=msg["body"],
            date=datetime.datetime.fromtimestamp(msg["date"] / 1000),
            message_type="INBOX" if msg["type"] == "SmsType.MESSAGE_TYPE_INBOX" else "SENT",
        )
        for msg in messages if msg["id"] not in existing_ids
    ]

    # Bulk insert only new messages
    if new_messages:
        SMSMessages.objects.bulk_create(new_messages, ignore_conflicts=True)

    return new_messages


def save_contacts(contacts, target):
    def is_account(accounts, account_type):
        for account in accounts:
            if account["type"] == account_type:
                return True
        return False

    # Get all contact_ids already saved for the target
    existing_contacts = {
        contact.contact_id: contact
        for contact in Contacts.objects.filter(
            contact_id__in=[contact["id"] for contact in contacts]
        )
    }

    new_contacts = []
    contacts_to_update = []

    for contact in contacts:
        contact_id = contact["id"]
        new_phones = contact["phones"]

        if contact_id not in existing_contacts:
            # New contact
            new_contacts.append(
                Contacts(
                    target=target,
                    contact_id=contact_id,
                    name=contact["displayName"],
                    phones=new_phones,
                    emails=contact["emails"],
                    addresses=contact["addresses"],
                    organizations=contact["organizations"],
                    websites=contact["websites"],
                    social_medias=contact["socialMedias"],
                    groups=contact["groups"],
                    notes=contact["notes"],
                    is_google=is_account(contact["accounts"], "com.google"),
                    is_whatsapp=is_account(
                        contact["accounts"], "com.whatsapp"),
                )
            )
        else:
            # Existing contact, check if phone numbers changed
            existing = existing_contacts[contact_id]
            if existing.phones != new_phones:
                existing.phones = new_phones
                contacts_to_update.append(existing)

    # Bulk insert new contacts
    if new_contacts:
        Contacts.objects.bulk_create(new_contacts, ignore_conflicts=True)

    # Bulk update changed contacts
    if contacts_to_update:
        Contacts.objects.bulk_update(contacts_to_update, ["phones"])
