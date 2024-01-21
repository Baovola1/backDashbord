import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getProducts = async (req, res)=>{
    try {
        const products = await Product.find();

        const productWithStats = await Promise.all(
            products.map(async(product)=>{
                const stat = await ProductStat.find({
                    productId: product._id
                })
                return {
                    ...product._doc,
                    stat,
                };
            })
        );
        res.status(200).json(productWithStats);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const getCustomers = async(req, res)=>{
    try {
      const customers = await User.find({role:"user"}).select("-password");
      res.status(200).json(customers);
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const getTransactions = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, sort = "{}", search = "" } = req.query;
        const pageNumber = parseInt(page);
        const pageSizeNumber = parseInt(pageSize);

        // Fonction pour générer le tri
        const generateSort = () => {
            try {
                const sortParsed = JSON.parse(sort);
                return {
                    [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1
                };
            } catch {
                return {}; // En cas d'erreur de parsing, retourne un objet vide
            }
        };

        // Vérifier si sort n'est pas vide et générer le sort si nécessaire
        const sortFormatted = sort !== "{}" ? generateSort() : {};

        // Appliquer la même recherche pour le comptage et la récupération des données
        const searchCriteria = {
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } },
            ],
        };

        // Trouver les transactions avec les critères de recherche
        const transactions = await Transaction.find(searchCriteria)
            .sort(sortFormatted)
            .skip((pageNumber - 1) * pageSizeNumber) 
            .limit(pageSizeNumber);

        // Compter le nombre total de documents qui correspondent à la recherche
        const total = await Transaction.countDocuments(searchCriteria);

        res.status(200).json({ transactions, total });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
