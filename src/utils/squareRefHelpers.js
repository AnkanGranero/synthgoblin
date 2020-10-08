function getCoordinatesFromRefName(refName) {
    let firstSplit = refName.split('r');
    let secondSplit = firstSplit[1].split('-');
    return { x: secondSplit[0], y: secondSplit[1]};
}

function getRefFromCoordinates(x, y) {
    return `r${x}-${y}`;
}


export { getCoordinatesFromRefName, getRefFromCoordinates };