import About from "../components/About";
import Skills from "../components/Skills";

function Home() {

    const skills = [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Python",
        "Git",
        "Machine Learning",
        "Cyber Security"
    ];

    return (

        <>

            <About image="/images/profile.jpg" />

            <Skills skills={skills} />

        </>

    );

}

export default Home;