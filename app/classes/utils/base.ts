export class BaseUtils {
    objectMaker(formData: FormData) {
        const result: Record<string, any> = {};
        const data = Object.fromEntries(formData);

        for (const key in data) {
            const value = data[key];
            const parts = key.split(".");

            let current = result;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];

                // If last part, set value
                if (i === parts.length - 1) {
                    current[part] = value;
                } else {
                    // Create nested object if it doesn't exist
                    if (!current[part] || typeof current[part] !== "object") {
                        current[part] = {};
                    }
                    current = current[part];
                }
            }
        }

        return result;
    }
}