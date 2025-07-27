import { TableCell } from "./table";

interface IProps {
    page: number;
    setPage: (page: number) => void;
    show: number;
    callLogsData: any[];
}
const TablePagination: React.FC<IProps> = ({ page, setPage, show, callLogsData }) => {
    return (
        <TableCell colSpan={12}>
            <div className="float-end flex gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>

                {/* Page Buttons with Smart Ellipsis */}
                {(() => {
                    const totalPages = Math.ceil(callLogsData.length / show);
                    let pages = [];
                    if (totalPages <= 10) {
                        // show all
                        for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                        }
                    } else {
                        pages.push(1);

                        let start = Math.max(2, page - 2);
                        let end = Math.min(totalPages - 1, page + 2);

                        if (start > 2) {
                            pages.push("ellipsis-prev");
                        }

                        for (let i = start; i <= end; i++) {
                            pages.push(i);
                        }

                        if (end < totalPages - 1) {
                            pages.push("ellipsis-next");
                        }

                        pages.push(totalPages);
                    }
                    return pages.map((p, idx) =>
                        typeof p === "number" ? (
                            <button
                                key={idx}
                                onClick={() => {
                                    setPage(p);
                                    window.scrollTo(0, 0);
                                    setCallLogs(callLogsData.slice((p - 1) * show, p * show));
                                }}
                                className={`px-3 py-1 border rounded ${page === p ? "bg-blue-500 text-white" : ""
                                    }`}
                            >
                                {p}
                            </button>
                        ) : (
                            <span key={idx} className="px-2">
                                ...
                            </span>
                        )
                    );
                })()}

                {/* Next Button */}
                <button
                    onClick={() => {
                        setPage((prev) =>
                            Math.min(prev + 1, Math.ceil(callLogsData.length / show))
                        );
                        window.scrollTo(0, 0);
                        setCallLogs(callLogsData.slice((page - 1) * show, page * show));
                    }
                    }
                    disabled={page === Math.ceil(callLogsData.length / show)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </TableCell>
    )
}

export default TablePagination