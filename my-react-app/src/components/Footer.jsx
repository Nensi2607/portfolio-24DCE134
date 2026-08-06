function Footer(props){

    return(

        <footer className="footer">

            <h2>Contact</h2>

            <p>Email : {props.email}</p>

            <p>Phone : {props.phone}</p>

            <p>© 2026 Student Portfolio</p>

        </footer>

    )

}

export default Footer;