
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaThLarge,
  FaDog,
  FaCat,
  FaDove,
  FaPaw,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "./ProductsPage.css";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedPetType, setSelectedPetType] =
    useState("All");

  const [sortBy, setSortBy] = useState("featured");

  const [showFilters, setShowFilters] =
    useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "shop/products/"
      );

      const productData =
        response.data.results ||
        response.data;

      setProducts(productData);
    } catch (error) {
      console.error(
        "Unable to load products:",
        error.response?.data || error.message
      );

      setError(
        "Unable to load products. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Create category list from the products.
   *
   * This means the page still works even if
   * you don't have a separate Categories API.
   */
  const categories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((product) => {
      const categoryId =
        product.category ||
        product.category_id ||
        product.category_name;

      const categoryName =
        product.category_name ||
        product.category?.name ||
        "Other";

      if (
        categoryId !== undefined &&
        categoryId !== null
      ) {
        categoryMap.set(
          String(categoryId),
          categoryName
        );
      }
    });

    return Array.from(
      categoryMap.entries()
    ).map(([id, name]) => ({
      id,
      name,
    }));
  }, [products]);

  /*
   * Pet types
   */
  const petTypes = useMemo(() => {
    const types = new Set();

    products.forEach((product) => {
      if (product.pet_type) {
        types.add(product.pet_type);
      }
    });

    return Array.from(types);
  }, [products]);

  /*
   * Filter + search + sorting
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * Search
     */
    if (search.trim()) {
      const searchText =
        search.toLowerCase().trim();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const brand =
          product.brand?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        const category =
          product.category_name?.toLowerCase() ||
          "";

        return (
          name.includes(searchText) ||
          brand.includes(searchText) ||
          description.includes(searchText) ||
          category.includes(searchText)
        );
      });
    }

    /*
     * Category
     */
    if (selectedCategory !== "All") {
      result = result.filter((product) => {
        const productCategory =
          product.category ||
          product.category_id ||
          product.category_name;

        return (
          String(productCategory) ===
          String(selectedCategory)
        );
      });
    }

    /*
     * Pet type
     */
    if (selectedPetType !== "All") {
      result = result.filter(
        (product) =>
          String(product.pet_type).toLowerCase() ===
          String(selectedPetType).toLowerCase()
      );
    }

    /*
     * Sorting
     */
    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sortBy === "rating") {
      result.sort(
        (a, b) =>
          Number(b.average_rating || 0) -
          Number(a.average_rating || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name).localeCompare(
          String(b.name)
        )
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    selectedPetType,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedPetType("All");
    setSortBy("featured");
  };

  /*
   * Category icon
   */
  const getCategoryIcon = (name) => {
    const categoryName =
      String(name).toLowerCase();

    if (
      categoryName.includes("dog")
    ) {
      return <FaDog />;
    }

    if (
      categoryName.includes("cat")
    ) {
      return <FaCat />;
    }

    if (
      categoryName.includes("bird")
    ) {
      return <FaDove />;
    }

    return <FaPaw />;
  };

  if (loading) {
    return (
      <div className="shop-page">
        <div className="container">
          <div className="shop-loading">
            <div className="shop-loading-icon">
              🐾
            </div>

            <h3>
              Loading PetCare Shop...
            </h3>

            <p>
              Finding the best products
              for your pets.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-page">
        <div className="container">

          <div className="shop-error">

            <div className="shop-error-icon">
              😿
            </div>

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              className="btn btn-primary"
              onClick={loadProducts}
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">

      <div className="container">

        {/* ================= HERO ================= */}

        <section className="shop-hero">

          <div className="shop-hero-content">

            <span className="shop-eyebrow">
              🐾 PETCARE HUB SHOP
            </span>

            <h1>
              Everything Your Pet
              <span> Deserves</span>
            </h1>

            <p>
              Discover quality food, toys,
              accessories, and essentials
              for your beloved companions.
            </p>

          </div>

          <div className="shop-hero-paws">
            {/* 🐶 🐱 🐦 */}
            <img src="https://img.magnific.com/premium-photo/large-group-pets-dogs-cats-ferret-rodents-birds-fish-turtle-sitting-standing-front-white-background_191971-32132.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
          </div>

        </section>

        {/* ================= SEARCH ================= */}

        <section className="shop-toolbar">

          <div className="shop-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                <FaTimes />
              </button>
            )}

          </div>

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() =>
              setShowFilters(!showFilters)
            }
          >
            <FaFilter />
            Filters
          </button>

          <div className="shop-sort">

            <label>
              Sort by
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="featured">
                Featured
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name
              </option>
            </select>

          </div>

        </section>

        {/* ================= CATEGORY SHOWCASE ================= */}

        <section className="category-section">

          <div className="section-heading">

            <div>
              <span>
                SHOP BY
              </span>

              <h2>
                Categories
              </h2>
            </div>

            <div className="category-count">
              {categories.length} categories
            </div>

          </div>

          <div className="category-scroll">

            <button
              type="button"
              className={`category-pill ${
                selectedCategory === "All"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory("All")
              }
            >
              <span className="category-icon">
                <FaThLarge />
              </span>

              <span>
                All Products
              </span>
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={`category-pill ${
                  String(
                    selectedCategory
                  ) === String(category.id)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    category.id
                  )
                }
              >
                <span className="category-icon">
                  {getCategoryIcon(
                    category.name
                  )}
                </span>

                <span>
                  {category.name}
                </span>
              </button>
            ))}

          </div>

        </section>

        {/* ================= MAIN SHOP ================= */}

        <section className="shop-content">

          {/* FILTER SIDEBAR */}

          <aside
            className={`shop-sidebar ${
              showFilters
                ? "mobile-visible"
                : ""
            }`}
          >

            <div className="sidebar-header">

              <div>
                <FaFilter />
                <strong>
                  Filters
                </strong>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(false)
                }
                className="sidebar-close"
              >
                <FaTimes />
              </button>

            </div>

            <div className="filter-group">

              <h4>
                Pet Type
              </h4>

              <label className="filter-option">

                <input
                  type="radio"
                  name="petType"
                  checked={
                    selectedPetType ===
                    "All"
                  }
                  onChange={() =>
                    setSelectedPetType("All")
                  }
                />

                <span>
                  All Pets
                </span>

              </label>

              {petTypes.map((type) => (
                <label
                  className="filter-option"
                  key={type}
                >

                  <input
                    type="radio"
                    name="petType"
                    checked={
                      selectedPetType ===
                      type
                    }
                    onChange={() =>
                      setSelectedPetType(
                        type
                      )
                    }
                  />

                  <span>
                    {type}
                  </span>

                </label>
              ))}

            </div>

            <div className="filter-group">

              <h4>
                Category
              </h4>

              <label className="filter-option">

                <input
                  type="radio"
                  name="category"
                  checked={
                    selectedCategory ===
                    "All"
                  }
                  onChange={() =>
                    setSelectedCategory("All")
                  }
                />

                <span>
                  All Categories
                </span>

              </label>

              {categories.map((category) => (
                <label
                  className="filter-option"
                  key={category.id}
                >

                  <input
                    type="radio"
                    name="category"
                    checked={
                      String(
                        selectedCategory
                      ) ===
                      String(category.id)
                    }
                    onChange={() =>
                      setSelectedCategory(
                        category.id
                      )
                    }
                  />

                  <span>
                    {category.name}
                  </span>

                </label>
              ))}

            </div>

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>

          </aside>

          {/* PRODUCT AREA */}

          <div className="shop-products-area">

            <div className="products-heading">

              <div>

                <h2>
                  {selectedCategory ===
                  "All"
                    ? "All Products"
                    : categories.find(
                        (category) =>
                          String(
                            category.id
                          ) ===
                          String(
                            selectedCategory
                          )
                      )?.name ||
                      "Products"}
                </h2>

                <p>
                  Showing{" "}
                  <strong>
                    {filteredProducts.length}
                  </strong>{" "}
                  products
                </p>

              </div>

              {(search ||
                selectedCategory !==
                  "All" ||
                selectedPetType !==
                  "All") && (
                <button
                  type="button"
                  className="clear-results"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}

            </div>

            {filteredProducts.length ===
            0 ? (

              <div className="no-products">

                <div>
                  🔍
                </div>

                <h3>
                  No products found
                </h3>

                <p>
                  Try changing your
                  search or filters.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Show All Products
                </button>

              </div>

            ) : (

              <div className="products-grid">

                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

              </div>

            )}

          </div>

        </section>

        {/* ================= BOTTOM CTA ================= */}

        <section className="shop-bottom-banner">

          <div>

            <span>
              🐾 PETCARE HUB
            </span>

            <h2>
              Everything for happier,
              healthier pets.
            </h2>

            <p>
              From everyday essentials to
              fun accessories, we've got
              your pet covered.
            </p>

          </div>

          <Link
            to="/pets"
            className="shop-banner-button"
          >
            Manage My Pets
          </Link>

        </section>

      </div>

    </div>
  );
}

export default ProductsPage;
