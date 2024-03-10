const { createInterface } = require('readline');
const objPeople = {};

/**
 * function to add person to familytree
 * @param {*} strName 
 */
function addPerson(strName) {
    objPeople[strName] = { strName, objRelationships: {} };
    console.log((`${strName} added to the family`));
}

/**
 * 
 * @param {*} strRelationship 
 */
function addRelationship(strRelationship) {
    for (const strName in objPeople) {
        if (!objPeople[strName].objRelationships) objPeople[strName].objRelationships = {};
        objPeople[strName].objRelationships[strRelationship] = [];
    }
    console.log((`${strRelationship} added as a relationship`));
}

/**
 * 
 * @param {strName1, strRelationship, strName2} param0 
 */
function connectRelationship({ strName1 = '', strRelationship = '', strName2 = '' }) {
    if (objPeople[strName2]) {

        const person = objPeople[strName2];

        if (!person.objRelationships[strRelationship]) {

            person.objRelationships[strRelationship] = [];

        }

        if (!person.objRelationships[strRelationship].includes(strName1)) {
            person.objRelationships[strRelationship].push(strName1);
            console.log(`Connected ${strName1} as ${strRelationship} of ${strName2}`);
        } else
            console.log(`Relationship ${strRelationship} already added`);
    } else
        console.log(`${strName2} not found`);
}


function getRelationshipCount({ strName, strRelationship }) {
    const objPerson = objPeople[strName];
    console.log({ strName, strRelationship, objPerson }, '===============?');
    if (objPerson) {
        return objPerson.objRelationships[strRelationship]?.length || 0;

    } else console.log(`${strName} not found`);
}

/**
 * @param {*} name 
 * @returns void or father name
 */
function getFather(strName) {
    let objFather = null;
    for (const strNames in objPeople) {
        if (objPeople[strNames]["objRelationships"]?.["DAUGHTER"]?.includes(strName))
            objFather = objPeople[strNames];
        if (objPeople[strNames]["objRelationships"]?.["SON"]?.includes(strName)) {
            objFather = objPeople[strNames];
        }
    }



    console.log({ strName, objFather });
    if (!objFather) {
        console.log(`${strName} not found in familyTree`);
        return;
    }
    return objFather.strName;

}

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});


function executeCommand(command) {

    let [strAction, ...arrParams] = command.split(' ');
    console.log({ strAction, arrParams });
    switch (strAction) {
        case 'add':
            handleAddCommand(arrParams);
            break;
        case 'connect':
            handleConectCommand(arrParams);
            break;
        case 'count':
            handleCountCommand(arrParams);
            break;
        case 'father':
            handleFatherCommand(arrParams);
            break;
        default:
            console.log('Invalid command');
    }
}

function handleAddCommand(arrParams) {
    const [strCategory, ...arrRest] = arrParams;

    console.log(arrRest.join(','));
    switch (strCategory) {
        case 'person':
            addPerson(arrRest.join(' ').toUpperCase());
            break;
        case 'relationship':
            addRelationship(arrRest.join(' ').toUpperCase());
            break;
        default:
            console.log('Invalid add command');
    }
}

function handleConectCommand(arrParams) {


    const intAsIndex = arrParams.indexOf('as');
    const intOfIndex = arrParams.indexOf('of');

    if (intAsIndex !== -1 && intOfIndex !== -1 && intAsIndex < intOfIndex) {
        const strName1 = arrParams.slice(0, intAsIndex).join(' ').toUpperCase();
        const strRelationship = arrParams[intAsIndex + 1].toUpperCase();
        const strName2 = arrParams.slice(intOfIndex + 1).join(' ').toUpperCase();
        connectRelationship({ strName1, strRelationship, strName2 });

    } else {
        console.log("No match found");
    }
}

function handleCountCommand(arrParams) {
    const [strRelationship, , ...arrName] = arrParams;
    const strName = arrName.join(' ');
    const count = getRelationshipCount({ strName: strName.toUpperCase(), strRelationship: strRelationship.toUpperCase() });
    console.log(`Count of ${strRelationship}s of ${strName}: ${count}`);
}

function handleFatherCommand(arrParams) {
    const [, ...arrName] = arrParams;
    const strName = arrName.join(' ');
    const strFather = getFather(strName.toUpperCase());

    if (strFather)
        console.log(`Father of ${strName}: ${strFather}`);
    else
        console.log(`${strName} does not have a recorded father.`);

}

rl.setPrompt('family-tree> ');
rl.prompt();

rl.on('line', (input) => {
    executeCommand(input.trim());
    console.log({ objPeople: JSON.stringify(objPeople) });
    rl.prompt();
}).on('close', () => {
    console.log('Exiting family-tree tool.');
    process.exit(0);
});
