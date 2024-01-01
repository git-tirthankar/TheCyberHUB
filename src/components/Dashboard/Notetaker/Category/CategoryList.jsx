import React from "react";
import { CategoriesListContainer, CategoriesListNoFound } from "./CategoryElements";
import CategoryItem from "./CategoryItem";

const CategoryList = ({ required, children, onPick, pickedCategory }) => {
    return (
        <CategoriesListContainer required={required}>
            {!children.length && <CategoriesListNoFound>There Are No {<br />} Unique Categories</CategoriesListNoFound>}
            {children.map((Category) => (
                <CategoryItem
                    key={Category.name}
                    category={Category}
                    onPick={onPick}
                    isPicked={Category.name === pickedCategory.name}
                />
            ))}
        </CategoriesListContainer>
    );
};
export default CategoryList;