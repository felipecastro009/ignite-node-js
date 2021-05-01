import { ICategoriesRepository } from "../interfaces/ICategoriesRepository";

interface IRequest {
    name: string;
    description: string;
}

class CreateCategoryService {
    constructor(private categoriesRepository: ICategoriesRepository) { }

    execute({ name, description }: IRequest): void {
        const categoryAlrealdyExists = this.categoriesRepository.findByName(name);

        if (categoryAlrealdyExists) {
            throw new Error('Cateogry alrealdy exists!');
        }

        this.categoriesRepository.create({
            name,
            description
        })
    }
}

export { CreateCategoryService }