import InitiativeReportForm from "@/components/InitiativeReportForm";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Quản lý và đăng ký sáng kiến của bạn.
        </p>
      </div>

      <InitiativeReportForm />
    </div>
  );
}
