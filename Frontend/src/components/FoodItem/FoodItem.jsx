import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  return (
    <div className="food-item" data-testid={`food-item-${id}`}>
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt=""
          data-testid={`food-item-image-${id}`}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add Button"
            data-testid={`add-to-cart-button-${id}`}
          />
        ) : (
          <div className="food-item-counter" data-testid={`item-counter-${id}`}>
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Decrease Button"
              data-testid={`decrease-button-${id}`}
            />
            <p data-testid={`cart-item-quantity-${id}`}>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Increase Button"
              data-testid={`increase-button-${id}`}
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p data-testid={`food-item-name-${id}`}>{name}</p>
          <img
            src={assets.rating_starts}
            alt="Rating"
            data-testid={`rating-stars`}
          />
        </div>
        <p className="food-item-desc" data-testid={`food-item-desc-${id}`}>
          {description}
        </p>
        <p className="food-item-price" data-testid={`food-item-price-${id}`}>
          ${price}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;
