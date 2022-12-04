
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { faeTraits } = require('./faeTraits');
const { maleGodTraits } = require('./maleGodTraits');
const { femaleGodTraits } = require('./femaleTraits');
//const path = require('path');


//collection info
const nftAmount = 5;
const nameThatwillApperInfrontOfTheNumberOfEachNftOnMarketPlaces = 'TrippyGodz'
const collectionDescirption = 'enter the collection description here'
const canvasWidth = 2000;
const canvasHight = 2000;

//Maximum amount of each type
const maxFae = 3;
const maxMale = 1;
const maxFemales = 1;

//this means 30% to get male, 30% to get female, 40% to get fae.
const chanceTogetMale = 0.3;
const chanceToGetFemale = 0.6;


//this don't touch!
let faes = 0;
let males = 0;
let females = 0;

const saveLayer = (_canvas, _idx, _metadata) => {
    console.log(_idx);
    console.log("Created:", _idx);
    fs.writeFileSync(`./output/json/${_idx}.json`, _metadata);
    console.log(_metadata);
    fs.writeFileSync(`./output/img/${_idx}.png`, _canvas.toBuffer('image/png'))
}

const drawNFT = async () => {

    const metadata = [];
    let counter = 1;

    const canvas = createCanvas(canvasWidth, canvasHight);
    const ctx = canvas.getContext("2d");

    try {
        while (counter <= nftAmount) {
            let randomNum = Math.random();

            console.log('counter', counter);
            const currentNFTmetaData = {
                name: `${nameThatwillApperInfrontOfTheNumberOfEachNftOnMarketPlaces}#${counter}`,
                image: `./${counter}.png`,
                description: collectionDescirption,
                attributes: [],
                id: counter,
                type: ''
            };
            //create Male
            if (randomNum <= chanceTogetMale && males < maxMale) {

                const getBackground = maleGodTraits('Background');
                const drawBackground = await loadImage(`./input/fae/Backgrounds/${getBackground}.png`);

                const getHeadGear = maleGodTraits('HeadGear');
                const drawHeadGear = await loadImage(`./input/gods/Headgear/${getHeadGear}.png`);

                const getIdols = maleGodTraits('Idols');
                const drawIdols = await loadImage(`./input/gods/Godess Idoles/${getIdols}.png`);

                const getBase = maleGodTraits('Base');
                const drawBase = await loadImage(`./input/gods/Male Gods Base/${getBase}.png`);

                // creates metadata json for each NFT
                // type_Trait: origin = base

                currentNFTmetaData.attributes.push({ 'trait_type': 'Origin', 'value': getBase });
                currentNFTmetaData.attributes.push({ 'trait_type': 'HeadGear', 'value': getHeadGear });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Background', 'value': getBackground });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Idol', 'value': getIdols });

                // The order here determines the drawing order of the layers
                ctx.drawImage(drawBackground, 0, 0);
                ctx.drawImage(drawHeadGear, 0, 0);
                ctx.drawImage(drawBase, 0, 0);

                //the lines below (line 86 - 95 ) determines if to add chest guard, if yes it draws it and adds it to the json
                //gotta move this entire block if you want to change the drawing order

                let withChestOrWithout = Math.random();
                if (withChestOrWithout < 0.3) {
                    const getChestGuard = maleGodTraits('ChestGuard');
                    const drawgetChestGuard = await loadImage(`./input/gods/GodChestguard/${getChestGuard}.png`);
                    currentNFTmetaData.attributes.push({ 'trait_type': 'Chest Guard', 'value': getChestGuard });
                    ctx.drawImage(drawgetChestGuard, 0, 0);
                }

                ctx.drawImage(drawIdols, 0, 0);

                currentNFTmetaData.type = 'Male'
                males++
            }
            //create creatFemale
            else if (randomNum <= chanceToGetFemale && females < maxFemales) {

                const getBackground = femaleGodTraits('Background');
                const drawBackground = await loadImage(`./input/fae/Backgrounds/${getBackground}.png`);

                const getHeadGear = maleGodTraits('HeadGear');
                const drawHeadGear = await loadImage(`./input/gods/Headgear/${getHeadGear}.png`);

                const getIdols = maleGodTraits('Idols');
                const drawIdols = await loadImage(`./input/gods/Godess Idoles/${getIdols}.png`);

                const getBase = maleGodTraits('Base');
                const drawBase = await loadImage(`./input/gods/Godess Base/${getBase}.png`);

                // creates metadata json for each NFT
                // type_Trait: origin = base

                currentNFTmetaData.attributes.push({ 'trait_type': 'Origin', 'value': getBase });
                currentNFTmetaData.attributes.push({ 'trait_type': 'HeadGear', 'value': getHeadGear });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Background', 'value': getBackground });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Idol', 'value': getIdols });

                // The order here determines the drawing order of the layers
                ctx.drawImage(drawBackground, 0, 0);
                ctx.drawImage(drawHeadGear, 0, 0);
                ctx.drawImage(drawBase, 0, 0);

                // the lines below(line 86 - 95) determines if to add chest guard, if yes it draws it and adds it to the json
                // gotta move this entire block if you want to change the drawing order
                let withChestOrWithout = Math.random();
                if (withChestOrWithout < 0.3) {
                    const getChestGuard = maleGodTraits('ChestGuard');
                    const drawgetChestGuard = await loadImage(`./input/gods/Godesschestgard/${getChestGuard}.png`);
                    currentNFTmetaData.attributes.push({ 'trait_type': 'Chest Guard', 'value': getChestGuard });
                    ctx.drawImage(drawgetChestGuard, 0, 0);
                }

                ctx.drawImage(drawIdols, 0, 0);
                currentNFTmetaData.type = 'female'
                females++
            }
            //create fae
            else if (faes < maxFae) {
                const getBackground = faeTraits('Background');
                const drawFaeBackground = await loadImage(`./input/fae/Backgrounds/${getBackground}.png`);

                const getBase = faeTraits('Base');
                const drawBase = await loadImage(`./input/fae/Base/${getBase}.png`);

                const getArtifact = faeTraits('Artifact');
                const drawArtifact = await loadImage(`./input/fae/Artifact/${getArtifact}.png`);

                const getChestGuard = faeTraits('chestGuard');
                const drawgetChestGuard = await loadImage(`./input/fae/chestGuard/${getChestGuard}.png`);

                const getMouth = faeTraits('Mouths');
                const drawMouth = await loadImage(`./input/fae/Mouths/${getMouth}.png`);

                const getTatto = faeTraits('FaceTattoos');
                const drawTatto = await loadImage(`./input/fae/Tattoo/${getTatto}.png`);

                const getIdols = faeTraits('Idols');
                const drawIdols = await loadImage(`./input/fae/Tattoo/${getIdols}.png`);


                //creates metadata json for each NFT
                currentNFTmetaData.attributes.push({ 'trait_type': 'Origin', 'value': getBase });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Background', 'value': getBackground });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Artifact', 'value': getArtifact });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Chest Guard', 'value': getChestGuard });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Mouths', 'value': getMouth });
                currentNFTmetaData.attributes.push({ 'trait_type': 'Face Tattoo', 'value': getTatto });

                // The order here determines the drawing order of the layers
                ctx.drawImage(drawFaeBackground, 0, 0);
                ctx.drawImage(drawBase, 0, 0);
                ctx.drawImage(drawArtifact, 0, 0);
                ctx.drawImage(drawgetChestGuard, 0, 0);
                ctx.drawImage(drawMouth, 0, 0);
                ctx.drawImage(drawTatto, 0, 0);
                ctx.drawImage(drawIdols, 0, 0);
                currentNFTmetaData.type = 'fae';
                faes++
            }



            saveLayer(canvas, counter, JSON.stringify(currentNFTmetaData));
            metadata.push(currentNFTmetaData)
            counter++

        }
    }
    catch (err) {
        console.log(err);
    }
    fs.writeFileSync(`./output/json/metadata.json`, JSON.stringify(metadata));
    console.log('male', males, 'female', females, 'fae', faes);
}


const runTasks = async () => {
    console.log('Gmolly molly - Generating your NFTs beeeboooppppzzz');
    console.log('make sure to delete the metadata.json file from the output/json folder');
    drawNFT();
}


runTasks()


