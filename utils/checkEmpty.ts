
const checkEmpty = (fields: Record<string, any>) => {
    const errors: string[] = [];

    for (const [key, value] of Object.entries(fields)) {
        if (!value || value === '') {
            errors.push(`${key} is required`);
        }
    }
    return {
        isError: errors.length > 0, error: errors.join(", ")
    };
};

export default checkEmpty;
