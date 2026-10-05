// ==========================================
// ME HAVE CPU - ระบบร้านค้าออนไลน์
// ==========================================

// ดึงข้อมูลตะกร้าจาก localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// เพิ่มสินค้าลงตะกร้า
// ==========================================

function addToCart(productName, price) {

    cart.push({
        name: productName,
        price: Number(price)
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("เพิ่ม " + productName + " ลงในตะกร้าแล้ว 🛒");

    updateCart();
}


// ==========================================
// แสดงสินค้าในหน้าตะกร้า
// ==========================================

function updateCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>ยังไม่มีสินค้าในตะกร้า 🛒</p>";

        if (cartTotal) {
            cartTotal.textContent = "0";
        }

        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += Number(item.price);

        cartItems.innerHTML += `
            <div class="cart-item">

                <span>${item.name}</span>

                <span>
                    ${Number(item.price).toLocaleString()} บาท
                </span>

                <button onclick="removeFromCart(${index})">
                    🗑️ ลบ
                </button>

            </div>
        `;
    });

    if (cartTotal) {
        cartTotal.textContent =
            total.toLocaleString();
    }
}


// ==========================================
// ลบสินค้าออกจากตะกร้า
// ==========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();
    updateCheckout();
}


// ==========================================
// ไปหน้าชำระเงิน
// ==========================================

function goToCheckout() {

    if (cart.length === 0) {

        alert("กรุณาเลือกสินค้าก่อนสั่งซื้อ 🛒");

        return;
    }

    window.location.href = "checkout.html";
}


// ==========================================
// แสดงสินค้าในหน้าชำระเงิน
// ==========================================

function updateCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    const productTotal =
        document.getElementById("product-total");

    const checkoutTotal =
        document.getElementById("checkout-total");

    // ถ้าไม่ใช่หน้า checkout
    if (!checkoutItems) {
        return;
    }

    // ถ้าไม่มีสินค้า
    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>ไม่มีสินค้าในตะกร้า</p>
        `;

        if (productTotal) {
            productTotal.textContent = "0 บาท";
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = "0";
        }

        return;
    }


    checkoutItems.innerHTML = "";

    let total = 0;


    // แสดงสินค้าแต่ละรายการ
    cart.forEach((item) => {

        const price = Number(item.price);

        total += price;

        checkoutItems.innerHTML += `
            <div class="checkout-item">

                <div>
                    <strong>${item.name}</strong>
                </div>

                <span>
                    ${price.toLocaleString()} บาท
                </span>

            </div>
        `;
    });


    // ค่าส่ง
    const shipping = 50;

    // รวมทั้งหมด
    const grandTotal = total + shipping;


    // แสดงราคาสินค้า
    if (productTotal) {

        productTotal.textContent =
            total.toLocaleString() + " บาท";
    }


    // แสดงยอดรวมทั้งหมด
    if (checkoutTotal) {

        checkoutTotal.textContent =
            grandTotal.toLocaleString();
    }
}


// ==========================================
// ยืนยันการสั่งซื้อ
// ==========================================

function confirmOrder() {

    // ดึงข้อมูลลูกค้า
    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const zipcode =
        document.getElementById("zipcode").value.trim();

    const address =
        document.getElementById("address").value.trim();


    // วิธีชำระเงิน
    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    // ตรวจสอบสินค้า
    if (cart.length === 0) {

        alert("ไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าก่อน");

        return;
    }


    // ตรวจสอบชื่อ
    if (name === "") {

        alert("กรุณากรอกชื่อ-นามสกุล");

        document.getElementById("customerName").focus();

        return;
    }


    // ตรวจสอบเบอร์
    if (phone === "") {

        alert("กรุณากรอกเบอร์โทรศัพท์");

        document.getElementById("phone").focus();

        return;
    }


    // ตรวจสอบรหัสไปรษณีย์
    if (zipcode === "") {

        alert("กรุณากรอกรหัสไปรษณีย์");

        document.getElementById("zipcode").focus();

        return;
    }


    // ตรวจสอบที่อยู่
    if (address === "") {

        alert("กรุณากรอกที่อยู่จัดส่ง");

        document.getElementById("address").focus();

        return;
    }


    // ตรวจสอบวิธีชำระเงิน
    if (!payment) {

        alert("กรุณาเลือกวิธีชำระเงิน");

        return;
    }


    // ======================================
    // สร้างเลขที่คำสั่งซื้อ
    // ======================================

    const date = new Date();

    const orderNumber =
        "MHC-" +
        date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0") +
        "-" +
        Math.floor(1000 + Math.random() * 9000);


    // ======================================
    // คำนวณยอดเงิน
    // ======================================

    let total = 0;

    cart.forEach((item) => {

        total += Number(item.price);

    });

    const shipping = 50;

    const grandTotal = total + shipping;


    // ======================================
    // บันทึกข้อมูลคำสั่งซื้อ
    // ======================================

    localStorage.setItem(
        "orderNumber",
        orderNumber
    );

    localStorage.setItem(
        "customerName",
        name
    );

    localStorage.setItem(
        "customerPhone",
        phone
    );

    localStorage.setItem(
        "customerZipcode",
        zipcode
    );

    localStorage.setItem(
        "customerAddress",
        address
    );

    localStorage.setItem(
        "paymentMethod",
        payment.value
    );

    localStorage.setItem(
        "orderTotal",
        grandTotal
    );

    localStorage.setItem(
        "orderItems",
        JSON.stringify(cart)
    );


    // ======================================
    // ไปหน้าสั่งซื้อสำเร็จ
    // ======================================

    window.location.href = "success.html";
}


// ==========================================
// ทำงานเมื่อเปิดหน้าเว็บ
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    updateCart();

    updateCheckout();

});
// ==========================================
// MEMBER SYSTEM - ME HAVE CPU
// ==========================================

function registerMember() {

    const name =
        document.getElementById("member-name").value.trim();

    const email =
        document.getElementById("member-email").value.trim();

    const phone =
        document.getElementById("member-phone").value.trim();

    const password =
        document.getElementById("member-password").value.trim();


    if (!name || !email || !phone || !password) {

        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");

        return;
    }


    const member = {

        name: name,
        email: email,
        phone: phone,
        password: password

    };


    localStorage.setItem(
        "member",
        JSON.stringify(member)
    );


    localStorage.setItem(
        "loggedIn",
        "true"
    );


    alert("สมัครสมาชิกสำเร็จ!");


    showMemberProfile();

}


function loginMember() {

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value.trim();


    const member =
        JSON.parse(localStorage.getItem("member"));


    if (!member) {

        alert("ยังไม่มีข้อมูลสมาชิก กรุณาสมัครสมาชิกก่อน");

        return;
    }


    if (
        email === member.email &&
        password === member.password
    ) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        alert("เข้าสู่ระบบสำเร็จ!");

        showMemberProfile();

    } else {

        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

    }

}


function logoutMember() {

    localStorage.setItem(
        "loggedIn",
        "false"
    );

    alert("ออกจากระบบแล้ว");

    showLogin();

}


function showLogin() {

    document.getElementById(
        "register-section"
    ).style.display = "none";

    document.getElementById(
        "login-section"
    ).style.display = "block";

    document.getElementById(
        "member-profile"
    ).style.display = "none";

}


function showRegister() {

    document.getElementById(
        "register-section"
    ).style.display = "block";

    document.getElementById(
        "login-section"
    ).style.display = "none";

    document.getElementById(
        "member-profile"
    ).style.display = "none";

}


function showMemberProfile() {

    const member =
        JSON.parse(localStorage.getItem("member"));


    if (!member) {

        showRegister();

        return;
    }


    document.getElementById(
        "register-section"
    ).style.display = "none";

    document.getElementById(
        "login-section"
    ).style.display = "none";

    document.getElementById(
        "member-profile"
    ).style.display = "block";


    document.getElementById(
        "profile-name"
    ).textContent = member.name;


    document.getElementById(
        "profile-email"
    ).textContent = member.email;


    document.getElementById(
        "profile-phone"
    ).textContent = member.phone;

}


// ตรวจสอบสถานะสมาชิกเมื่อเปิดหน้า member.html

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.getElementById("member-profile")
        ) {

            const loggedIn =
                localStorage.getItem("loggedIn");

            if (loggedIn === "true") {

                showMemberProfile();

            }

        }

    }
);
// ==========================================
// PAYMENT SYSTEM - ME HAVE CPU
// ==========================================

function showPaymentDetail(type) {

    const box =
        document.getElementById("payment-detail");

    if (!box) return;


    if (type === "bank") {

        box.innerHTML = `

            <div class="payment-bank">

                <h3>🏦 ข้อมูลบัญชีธนาคาร</h3>

                <p>
                    <strong>ธนาคาร:</strong>
                    ไทยพาณิชย์ (SCB)
                </p>

                <p>
                    <strong>ชื่อบัญชี:</strong>
                    นายเสริมมงคล วะภักเพชร
                </p>

                <p>
                    <strong>เลขบัญชี:</strong>
                    0984918995
                </p>

                <p class="payment-note">
                    ⚠️ กรุณาตรวจสอบยอดเงินก่อนยืนยันคำสั่งซื้อ
                </p>

            </div>

        `;

    }


    else if (type === "promptpay") {

        box.innerHTML = `

            <div class="payment-promptpay">

                <div class="fake-qr">
                     <img src="qr-code.jpg" alt="QR Code สำหรับชำระเงิน">
                </div>

                <h3>📱 PromptPay</h3>

                <p>
                    สแกน QR Code เพื่อชำระเงิน
                </p>

                <p>
                    <strong>
                        PromptPay ID:
                        098-491-8995
                    </strong>
                </p>

                <p class="payment-note">
                    กรุณาตรวจสอบชื่อผู้รับเงินก่อนชำระเงิน
                </p>

            </div>

        `;

    }


    else if (type === "cod") {

        box.innerHTML = `

            <div class="payment-cod">

                <div class="cod-icon">
                    💵
                </div>

                <h3>
                    เก็บเงินปลายทาง
                </h3>

                <p>
                    ชำระเงินกับพนักงานจัดส่ง
                    เมื่อได้รับสินค้า
                </p>

                <p class="payment-note">
                    📦 กรุณาเตรียมเงินให้พอดีกับยอดชำระ
                </p>

            </div>

        `;

    }

}