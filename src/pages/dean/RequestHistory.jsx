import { useState } from "react";

const requestData = [
  { id: "#TR-8790", staff: "Prof. Alan Smith", destination: "National Library", date: "Oct 20, 2023", status: "Approved" },
  { id: "#TR-8788", staff: "Sarah Connor", destination: "Airport (Intl.)", date: "Oct 19, 2023", status: "Declined" },
  { id: "#TR-8785", staff: "Robert Lang", destination: "Convention Center", date: "Oct 18, 2023", status: "Approved" },
  { id: "#TR-8781", staff: "Dr. Emily Chen", destination: "City Hospital", date: "Oct 17, 2023", status: "Approved" },
  { id: "#TR-8779", staff: "Mark Thompson", destination: "Central Station", date: "Oct 16, 2023", status: "Declined" },
  { id: "#TR-8775", staff: "Aisha Patel", destination: "Tech Conference Hall", date: "Oct 15, 2023", status: "Approved" },
  { id: "#TR-8772", staff: "James Oduya", destination: "Government House", date: "Oct 14, 2023", status: "Approved" },
  { id: "#TR-8770", staff: "Lena Müller", destination: "Research Institute", date: "Oct 13, 2023", status: "Declined" },
];


export default function RequestHistory() {
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const rowsPerPage = 5;

  const filtered = requestData.filter((r) => {
    const matchSearch =
      r.staff.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div style={styles.root}>
      {/* Main Content */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.topbar}>
        
         
        </header>

        {/* Page heading */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Request History</h1>
            <div style={styles.userInfo}>
          </div>
          <div style={styles.pageSubtitle}><p>View and manage all historical transport requests and their final status.</p>
          </div>
        </div>
       </div>    
        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Request ID", "Staff Name", "Destination", "Action Date", "Status"].map((col) => (
                  <th key={col} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyCell}>No records found.</td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr key={row.id} style={{ ...styles.tr, backgroundColor: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                    <td style={styles.td}>
                      <span style={styles.requestId}>{row.id}</span>
                    </td>
                    <td style={styles.td}>{row.staff}</td>
                    <td style={styles.td}>{row.destination}</td>
                    <td style={styles.td}>{row.date}</td>
                    <td style={styles.td}>
                      <span style={row.status === "Approved" ? styles.badgeApproved : styles.badgeDeclined}>
                        ● {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.paginationRow}>
          <span style={styles.paginationInfo}>
            Showing {Math.min((page - 1) * rowsPerPage + 1, filtered.length)}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} historical records
          </span>
          <div style={styles.paginationBtns}>
            <button
              style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                style={{ ...styles.pageBtn, ...(page === i + 1 ? styles.pageBtnActive : {}) }}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button
              style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >›</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    height: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f1f5f9",
    overflow: "hidden",
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 16px 16px",
    borderBottom: "1px solid #e2e8f0",
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "linear-gradient(135deg, #06b6d4, #2A9D8F)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    flexShrink: 0,
  },
  brandName: {
    fontWeight: 700,
    fontSize: 15,
    color: "#0f172a",
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
  },
  brandSub: {
    fontSize: 11,
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },
  toggleBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: 18,
    flexShrink: 0,
    lineHeight: 1,
    padding: 2,
  },
  nav: {
    padding: "12px 8px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#64748b",
    fontSize: 13.5,
    fontWeight: 500,
    whiteSpace: "nowrap",
    transition: "background 0.15s",
  },
  navItemActive: {
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: 600,
  },
  navIcon: { fontSize: 15, flexShrink: 0 },
  navLabel: {},
  sidebarBottom: {
    padding: "8px 8px 16px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    minWidth: 0,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  notifBell: { fontSize: 18, cursor: "pointer" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" },
  userRole: { fontSize: 11, color: "#94a3b8" },
  pageHeader: {
    padding: "24px 28px 12px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  pageTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.4px",
  },
  pageSubtitle: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#64748b",
  },
  filtersRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px 14px",
    gap: 12,
    flexWrap: "wrap",
  },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    color: "#64748b",
  },
  
  tableSearch: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 7,
    padding: "7px 12px",
  },
  
  tableWrap: {
    margin: "0 28px",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 18px",
    textAlign: "left",
    fontSize: 11.5,
    fontWeight: 700,
    color: "#f5f6f9ff",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: "#2A9D8F",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: {
    transition: "background 0.1s",
  },
  td: {
    padding: "13px 18px",
    fontSize: 13.5,
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
  },
  requestId: {
    fontFamily: "monospace",
    fontWeight: 600,
    color: "#1e293b",
    fontSize: 13,
  },
  badgeApproved: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "#dcfce7",
    color: "#16a34a",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  badgeDeclined: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  emptyCell: {
    padding: "32px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
  },
  paginationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px 24px",
  },
  paginationInfo: {
    fontSize: 12.5,
    color: "#94a3b8",
  },
  paginationBtns: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  pageBtn: {
    width: 32,
    height: 32,
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  
};