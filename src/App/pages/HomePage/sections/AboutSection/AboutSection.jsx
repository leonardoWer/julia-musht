import "./AboutSection.css"

import AboutTile from "./components/AboutTile.jsx";

function AboutSection() {

    const aboutTilesData = [
        {
            title: "Lorem 40 Ipsum",
            hoverImg: "img/slider/1.jpg",
        },
        {
            title: "Solom dor 1",
            hoverImg: "img/slider/8.jpg",
        },
        {
            title: "Helvetioas asdaf",
            hoverImg: "img/slider/2.jpg",
        },
    ]

    return (
        <section id="aboutSection">
            <div className="about-container">

                <p className="about-rg-text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae doloremque dolores excepturi expedita natus sunt tempora tenetur ut voluptatibus. Ab accusantium, aliquam aut earum eligendi magni non provident tempora vel!
                </p>

                <div className="about-tiles-container">
                    {aboutTilesData.map((tile, index) => (
                        <AboutTile
                            key={index}
                            title={tile.title}
                            hoverImg={tile.hoverImg}
                            index={index}>
                        </AboutTile>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AboutSection;