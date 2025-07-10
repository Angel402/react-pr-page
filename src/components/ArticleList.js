import React, {useEffect} from "react";
import Article from "./Article";


const ArticleList = ({ quality, articles }) => {

    return (
        <section id={`calidad-${quality}`} className="my-5">
            <div className="container">
                <h4 className="text-center mb-2 ms-4">{quality}</h4>
                <div className="text-center">
                    {articles.map((article, index) => (
                        
                        <div className="mb-4 d-inline-flex" key={index}>
                            <Article
                                id={article.id}
                                name={article.tags.find((tag) => tag.tipo === "nombre")?.valor}
                                description={article.tags.find((tag) => tag.tipo === "country")?.valor + " - "+article.tags.find((tag) => tag.tipo === "ciudad")?.valor}
                                image={article?.media[0]?.file_path}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArticleList;
