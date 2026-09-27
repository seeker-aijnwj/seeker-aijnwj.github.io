
export default function Header() {
    return (

        <header className="site-header">
            <div className="container nav">
                <a className="brand" href="index.html">Nincekon <span>YORO Zandé</span></a>
                <button className="nav-toggle" aria-expanded="false" aria-controls="primary-nav"
                        aria-label="Ouvrir le menu">
                    <span className="bar"></span><span className="bar"></span><span className="bar"></span>
                </button>
                <ul className="nav-list" id="primary-nav">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="apropos.html">À propos</a></li>
                    <li><a href="portfolio.html">Portfolio</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="boutique.html">Boutique</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
        </header>

    );
}