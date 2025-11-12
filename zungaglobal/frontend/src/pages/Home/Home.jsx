import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import ProductPreview from '../../components/ProductPreview/ProductPreview';
import CategoryShowcase from '../../components/CategoryShowcase/CategoryShowcase';
import CallToAction from '../../components/CallToAction/CallToAction';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <Hero />
        <ProductPreview />
        <CategoryShowcase />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;