export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    status: "active" | "inactive";
}

export interface BannerFormData {
    title: string;
    imageUrl: string;
    status: "active" | "inactive";
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    status: "active" | "out_of_stock";
}

export interface ProductFormData {
    name: string;
    price: number;
    category: string;
    status: "active" | "out_of_stock";
}

export interface News {
    id: string;
    title: string;
    category: string;
    publishedDate: string;
    status: "published" | "draft";
}

export interface NewsFormData {
    title: string;
    category: string;
    status: "published" | "draft";
}
