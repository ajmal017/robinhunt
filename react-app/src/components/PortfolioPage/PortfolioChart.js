import React from 'react';
import PieChart, { Series,HoverStyle} from 'devextreme-react/pie-chart';

const PortfolioChart = ({ trades }) => {
    return (
        <PieChart
            id="pie"
            type="doughnut"
            palette="Green Mist" 
            dataSource={trades}
        >
            <Series argumentField="ticker" valueField="order_price">
                <HoverStyle color="#ffd700" />
            </Series>
        </PieChart>
    );
    }

export default PortfolioChart;
