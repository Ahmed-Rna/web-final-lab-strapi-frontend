
import Image from 'next/image'

function Navbar() {
    

    return (<>
    
    
            {/* <div className='h-auto bg-red-600 text-base text-white p-1 text-center'>Whoops! The store is not frying at the moment. We open at 11:00 AM.</div>
         */}
        <nav className="relative flex justify-between items-center py-2 px-4 md:px-20 lg:px-40">
            <div className="flex gap-3 md:gap-7">
                <a href="#" className="hover:underline">
                    <Image
                        src={"/logo.png"}
                        alt="Logo"
                        width={70}
                        height={70}
                        className="rounded-full hover:opacity-80 transition-opacity duration-300"
                    />
                </a>
                <a href="#" className="hidden md:flex items-center gap-2 font-bold  text-gray-700 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                    </svg>
                    Delivery to  <br /> Lahore , Pakistan
                </a>
            </div>

            <div className="flex items-center">
                {/* Desktop Menu */}
                <div className="hidden md:flex gap-7 items-center">
                    <a href="#" className="underline font-light text-md">Become a Franchise</a>
                    <a href="#" className="bg-yellow-500 rounded p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" className="bi bi-handbag" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z" />
                        </svg>
                    </a>
                    <a href="#" className="hover:underline">
                        <button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300">
                            Sign In / Register
                        </button>
                    </a>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex gap-4 items-center">
                    <a href="#" className="bg-yellow-500 rounded p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" className="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                    </a>
                    <button className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                
            </div>
        </nav>
    </>
    )
}

export default Navbar
