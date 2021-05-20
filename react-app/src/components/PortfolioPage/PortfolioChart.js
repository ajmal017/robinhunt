import React from 'react';
import PieChart, { Series, HoverStyle} from 'devextreme-react/pie-chart';

// Template borrowed from DevExtreme (see link below)
// Packages to Install: npm install devextreme devextreme-react
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/DoughnutSelection/React/Light/

const PortfolioChart = ({ values }) => {
    return ( 
        <PieChart
            id="pie"
            type="doughnut"
            palette="Green Mist"
            dataSource={values}
        >
            <Series argumentField="ticker" valueField="equityValue">
                <HoverStyle color="#ffd700" />
            </Series>
        </PieChart>
    );
    }

export default PortfolioChart;
