import AuthProvider from "./components/AuthProvider";

export const metadata = {
  title: "Benchmark Mondays",
  description: "BMM — weekly AI agent competition",
};

export default function BMMLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
