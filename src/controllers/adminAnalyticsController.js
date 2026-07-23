const Order = require("../models/Order");
const User = require("../models/User");
const Menu = require("../models/MenuItem");


// =======================================
// ADMIN ANALYTICS DASHBOARD
// =======================================

exports.getAnalytics = async (req, res) => {

  try {


    // ===============================
    // BASIC COUNTS
    // ===============================


    const totalOrders = await Order.countDocuments();


    const totalCustomers = await User.countDocuments({
      role: "CUSTOMER"
    });


    const totalMeals = await Menu.countDocuments();



    // ===============================
    // ORDER STATUS
    // ===============================


    const pendingOrders = await Order.countDocuments({
      status: "pending"
    });


    const deliveredOrders = await Order.countDocuments({
      status: "delivered"
    });



    const cancelledOrders = await Order.countDocuments({
      status: "cancelled"
    });





    // ===============================
    // TOTAL REVENUE
    // ONLY COMPLETED ORDERS
    // ===============================


    const revenueResult = await Order.aggregate([

      {
        $match:{
          status:"delivered"
        }
      },


      {
        $group:{
          _id:null,
          total:{
            $sum:"$total"
          }
        }
      }

    ]);



    const totalRevenue =
      revenueResult.length > 0
      ? revenueResult[0].total
      : 0;







    // ===============================
    // MONTHLY ORDERS BAR CHART
    // ===============================


    const monthlyOrders = await Order.aggregate([

      {
        $group:{

          _id:{
            month:{
              $month:"$createdAt"
            }
          },

          orders:{
            $sum:1
          }

        }
      },


      {
        $sort:{
          "_id.month":1
        }
      }


    ]);








    // ===============================
    // ORDER STATUS PIE CHART
    // ===============================


    const orderStatus = await Order.aggregate([


      {
        $group:{

          _id:"$status",

          value:{
            $sum:1
          }

        }

      }


    ]);







    res.status(200).json({

      success:true,

      data:{


        summary:{


          totalOrders,

          totalRevenue,

          pendingOrders,

          deliveredOrders,

          cancelledOrders,

          totalCustomers,

          totalMeals


        },


        monthlyOrders,


        orderStatus



      }


    });



  } catch(error){


    console.log(
      "Analytics Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:"Failed to fetch analytics data"

    });


  }

};