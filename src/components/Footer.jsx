
export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <div>
                    <p className="text-white"><strong>Nincekon</strong></p>
                    <p className="text-white" title="Espace réservé — remplacez par votre ville et pays">
                        Port Bouët - Gonzagueville, Abidjan, Côte d'Ivoire <br/>
                        (+225) 0706840174 / 0544725894
                    </p>
                </div>
                <nav aria-label="Pied de page">
                    <ul>
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="apropos.html">À propos</a></li>
                        <li><a href="portfolio.html">Portfolio</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="boutique.html">Boutique</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="admin.html" className="admin-link">Admin</a></li>
                    </ul>
                </nav>
            </div>
            <div className="container footer-note">&copy; <span id="year"></span> Nincekon. Tous droits réservés.</div>
        </footer>
    );
}