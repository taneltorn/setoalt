export const mapFields = (input: any): any => {
    if (Array.isArray(input)) {
        return input.map(element => mapFields(element));
    } else if (input !== null && typeof input === 'object') {
        const newObj: any = {};
        Object.keys(input).forEach((key) => {
            const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase()
                    .replace('-', '')
                    .replace('_', '');
            });
            newObj[camelKey] = mapFields(input[key]); // Recursively apply to nested objects/arrays
        });
        return newObj;
    }
    return input; // Return the input as is if it's not an object or array
};
