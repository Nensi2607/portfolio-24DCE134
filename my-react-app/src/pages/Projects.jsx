import { useEffect, useState } from "react";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {

    const [repos, setRepos] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");



    const fetchRepos = () => {

        setLoading(true);

        setError("");

        fetch("https://api.github.com/users/Nensi2607/repos")

            .then((response) => {

                if (!response.ok) {

                    throw new Error("Unable to fetch repositories");

                }

                return response.json();

            })

            .then((data) => {

                setRepos(data);

            })

            .catch((err) => {

                setError(err.message);

            })

            .finally(() => {

                setLoading(false);

            });

    };



    useEffect(() => {

        fetchRepos();

    }, []);



    if (loading) return <Spinner />;

    if (error)

        return (

            <ErrorMessage

                message={error}

                retry={fetchRepos}

            />

        );



    const filteredRepos = repos.filter((repo) =>

        repo.name.toLowerCase().includes(search.toLowerCase())

    );



    return (

        <section className="projects-container">

            <h2>My GitHub Repositories</h2>

            <input

                type="text"

                placeholder="Search repository..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

            />

            <div className="repo-grid">

                {

                    filteredRepos.map((repo) => (

                        <div className="repo-card" key={repo.id}>

                            <h3>{repo.name}</h3>

                            <p>⭐ {repo.stargazers_count}</p>

                            <a

                                href={repo.html_url}

                                target="_blank"

                                rel="noreferrer"

                            >

                                View Repository

                            </a>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default Projects;