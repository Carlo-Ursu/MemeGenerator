import React from "react"
import html2canvas from "html2canvas";



export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = React.useState([])

    React.useEffect(() => {
        async function getMemes() {
            const res = await fetch("https://api.imgflip.com/get_memes");
            const data = await res.json()
            setAllMemes(data.data.memes)
        }
        getMemes()
    }, [])

    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
    }

    function handleChange(event) {
        const { name, value } = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    const [downloadPressed, setDownloadPressed] = React.useState(false);

    function downloadMeme() {
        setDownloadPressed(true);
    }

    React.useEffect(() => {
        if (!downloadPressed) {
          return;
        }
      
        const memeDiv = document.querySelector(".meme");
        const memeImg = document.querySelector(".meme--image");
        memeImg.crossOrigin = "anonymous";
        const canvas = document.createElement('canvas');
        canvas.width = memeDiv.offsetWidth;
        canvas.height = memeDiv.offsetHeight;

        memeImg.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(memeImg, 0, 0, canvas.width, canvas.height);
            ctx.font = "30px Impact";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            let textWidth = ctx.measureText(meme.topText).width;
            ctx.fillText(meme.topText, canvas.width / 2, 20);
            ctx.textBaseline = "bottom";
            textWidth = ctx.measureText(meme.bottomText).width;
            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20);
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "meme.png";
            link.click();
        };
            
        memeImg.src = memeImg.src;
      }, [downloadPressed]);




    return (
        <main>
            <div className="form">
                <input
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a new meme image 🖼
                </button>
            </div>
            <div className="meme">
                <img src={meme.randomImage} className="meme--image" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>

            <button onClick={() => downloadMeme()}>Download Meme</button>
        </main>
    )
}