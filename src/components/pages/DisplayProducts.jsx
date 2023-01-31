import React from 'react'
import HeroSection from '../assestsComponents/HeroSection';
import NavList from '../assestsComponents/NavList';
import ClampLines from 'react-clamp-lines';
import useElemntOnScreen from '../../hooks/useElemntOnScreen';
import { useEffect , useRef ,  useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom' ;

const options = {
    root : null,
    rootMargin:'0px',
    threshold: 0.3
}

function DisplayProducts({page , products}) {
    


    const {pageNumber} = useParams();
    
    const navigate = useNavigate();
    
    const [itemsPerPage , setItemsPerPage] = useState(2);
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;

    const currentItems = products.slice(itemOffset, endOffset);

    const pageCount = Math.ceil(products.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        setItemOffset(newOffset);
        navigate(`/${page}/${event.selected + 1}`)
    };


    useEffect(() => {
        if(pageNumber){
            if(pageNumber > 0 && pageNumber <= pageCount){
                handlePageClick({selected : pageNumber - 1})
            }
        }
    },[pageCount]);

    

  return (
    <main className='display-products'>
        <h2 className='main-header'>{page}</h2>
        <section className='products-cards ' >
            {currentItems.length && 
            currentItems.map(e => {
                return (
                    <PruductsPagi e={e} key={e.id}/>
                )
            })
            }
            <ReactPaginate 
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            forcePage = {(pageNumber > 0 && pageNumber <= pageCount) ? pageNumber - 1 : null}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            marginPagesDisplayed={1}
            className='pagination-list'
            />
        </section>
        <section className='nav-section'>
            <NavList/>
        </section>
        <HeroSection/>
    </main>
    
  )
}

export default DisplayProducts

function PruductsPagi({e}){

    const navigate = useNavigate();
    const seeProductHandler = (id) => {
        navigate(`/product/${id}`);
    }

    const cardRef = useRef(null);
    const cardVis = useElemntOnScreen(options,cardRef);

    useEffect(() => {
        if(cardVis){
            cardRef.current.classList.add('show');
        }else{
            cardRef.current.classList.remove('show');
        }
    },[cardVis]);

    return (
        <div className='card hidden' key={e.id} ref={cardRef}>
            <img src={e?.images[0]} alt="product-img" />
            <div className='products-info'>
                <h3>{e?.productName}</h3>
                <ClampLines
                text={e?.about}
                id="really-unique-id"
                lines={4}
                ellipsis="..."
                moreText="Show More..."
                lessText="Show Less..."
                className="about-p"
                innerElement="p"
                />
                <button 
                className='see-product'
                onClick={() => seeProductHandler(e.id)}
                >
                    SEE Product
                </button>
            </div>
        </div>
    )
}