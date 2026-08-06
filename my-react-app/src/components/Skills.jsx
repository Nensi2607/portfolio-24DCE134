function Skills(props){
    return(
        <section className="skills">
            <h2>My Skills</h2>
            <div className="skill-box">
                {
                    props.skills.map((skill,index)=>
                        <div className="card" key={index}>
                            {skill}
                        </div>
                    )
                }
            </div>
        </section>
    )

}

export default Skills;