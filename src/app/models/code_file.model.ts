export interface CodeFile {
    name: string;
    code: string;
    is_entrypoint: boolean;
    changeText: boolean;
}

export function GenerateCodeFile(): CodeFile {
    const faker =  {} as CodeFile;
    faker.name = "default_code_file"
    faker.code = '';
    faker.is_entrypoint = true;
    faker.changeText = true;
    return faker;
}