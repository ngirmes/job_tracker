export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t-2 border-black bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Hunters</p>
        <p className="mt-2">Contact: hunters@example.com</p>
      </div>
    </footer>
  );
}
