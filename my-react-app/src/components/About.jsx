function About(props){

    return(

        <section className="about">

            <img src={props.image} alt="profile" />

            <div>

                <h2>About Me</h2>

                <p>

                    Hello! I am a Computer Engineering student passionate about
                    Web Development, React, Machine Learning and Cyber Security.

                    I enjoy building responsive websites and continuously
                    learning new technologies.

                </p>

            </div>

        </section>

    )

}

export default About;