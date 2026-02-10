import Link from "next/link";

export default function HeaderNav() {
    return (
        <header className="agent-header">
            <Link href="/" className="agent-header-logo">
                boilerplate
            </Link>
            <nav className="agent-header-nav">
                <Link href="/work" className="agent-header-link">Work</Link>
                <Link href="/#about" className="agent-header-link">About</Link>
            </nav>
        </header>
    );
}
