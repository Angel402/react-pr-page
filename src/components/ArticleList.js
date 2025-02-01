import React from "react";
import Article from "./Article";

const ArticleList = ({ quality, articles }) => {
    return (
        <section id={`calidad-${quality}`} className="my-5">
            <div className="container">
                <h4 className="text-left mb-2 ms-4">{quality}</h4>
                <div >
                    {articles.map((article, index) => (
                        <div className="mb-4 d-inline-flex" key={index}>
                            <Article
                                id={article.id}
                                name={article.nombre}
                                description={article.mapa}
                                
                                image={"https://lobasvip.com.ve/" + article?.media[0]?.file_path}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArticleList;
