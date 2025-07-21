from inertia import inertia


@inertia("Hello")
def hello_view(request):
    return {"user": {"name": "Adolph"}}

@inertia("Dashboard")
def dashboard(request):
    return {}