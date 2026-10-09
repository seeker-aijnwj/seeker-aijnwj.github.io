import '../styles/PageHeader.css'

export default function PageHeader(props) {

    const title = props.title ? `${props.title}` : "Boutique"
    const description = props.description ? `${props.description}` : "Guides, accompagnements et outils prêts à l'emploi, dans mes trois domaines. Paiement simple par Mobile Money (Wave, Orange Money, MTN MoMo, Moov Flooz) ou Lemfi."

    return (
        <div className="page-header container">
            <h1>{title}</h1>
            <p>
                {description}
            </p>
        </div>
    );
}