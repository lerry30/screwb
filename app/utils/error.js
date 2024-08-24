
export const handleError = (error) => {
    const errorData = error?.cause?.payload?.errorData;
    if(!errorData) return {};

    if(typeof errorData === 'object') {
        const errors = {};
        for(const [ key, value ] of Object.entries(errorData)) {
            errors[key] = value;
        }

        return errors;
    }

    return { [errorData]: error.message };
}
