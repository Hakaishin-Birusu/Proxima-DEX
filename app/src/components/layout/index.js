import React from "react";
import Header from "../header";
function Layout(props) {
    return (
        <div>
            <Header />
            <div className="container">

                <div className="col-md-12">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Layout;