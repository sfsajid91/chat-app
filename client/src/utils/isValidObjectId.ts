// function for checking mongoose object id
export const isValidObjectId = (id: string) => {
    const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
    return checkForHexRegExp.test(id);
};
