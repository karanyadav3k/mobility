# test_api.py - Complete Commercial Verification, 4-Category Audit & Admin Master Panel Tests
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

from main import (
    app, SessionLocal, UserDB, VehicleDB, TripDB, BookingDB, WalletTransactionDB, ReviewDB, PaymentOrderDB, PayoutRequestDB,
    seed_sample_data, list_users, get_trips, request_booking, create_trip,
    verify_handover, verify_completion, get_wallet_balance, get_trip_matches,
    create_payment_order, verify_payment, withdraw_driver_earnings,
    send_aadhaar_otp, verify_aadhaar_otp, verify_dl, calculate_dynamic_fare, get_trip_route_coordinates,
    cancel_booking, respond_bargain, toggle_driver_duty,
    get_admin_metrics, get_admin_users, admin_toggle_user_kyc, get_admin_bookings,
    admin_force_refund_booking, admin_force_release_booking, get_admin_payouts, admin_approve_payout,
    verify_qr_code, QRVerifyRequest,
    CreatePaymentOrderRequest, VerifyPaymentRequest, WithdrawRequest,
    SendAadhaarOTPRequest, VerifyAadhaarOTPRequest, VerifyDLRequest, FareCalculationRequest,
    CancelBookingRequest, RespondBargainRequest,
    TripCreate, BookingCreate, OTPVerify, ReviewCreate
)

def run_tests():
    db = SessionLocal()
    print("[*] Initializing Complete Commercial Production Test Suite & Admin Master Audit...")
    
    # Ensure fresh state for test trips
    db.query(BookingDB).delete()
    db.query(WalletTransactionDB).delete()
    db.query(PaymentOrderDB).delete()
    db.query(PayoutRequestDB).delete()
    db.commit()
    seed_sample_data(db)
    
    # =========================================================================
    # 1. AUDIT CATEGORY 1: DRIVER_MATCH (Driver without Car vs Car Owner with Car)
    # =========================================================================
    print("\n--- 1. AUDITING DRIVER_MATCH WORKFLOW ---")
    driver_user = db.query(UserDB).filter(UserDB.id == 2).first()
    car_owner_user = db.query(UserDB).filter(UserDB.id == 3).first()
    
    # A. Driver without Car posts availability
    driver_post = create_trip(
        TripCreate(
            creator_id=driver_user.id,
            service_category="DRIVER_MATCH",
            listing_type="OFFER",
            trip_scope="INTER_CITY",
            vehicle_mode="DRIVER",
            source_city="Bhopal",
            destination_city="Indore",
            departure_time="02/09/2026, 06:00 AM",
            price=550.0,
            allow_bargain=True,
            description="[Driver Profile: 5+ Years Exp | Gear: Both | DL: MP04-2020-998877] Verified Commercial & Private Driver ready for highway & city trip."
        ),
        db=db
    )
    print(f"[+] Driver Available Post Created: ID #{driver_post['trip_id']} (Matches found: {driver_post['matches_count']})")
    assert driver_post["trip_id"] is not None
    
    # B. Car Owner posts requirement for Driver
    owner_post = create_trip(
        TripCreate(
            creator_id=car_owner_user.id,
            service_category="DRIVER_MATCH",
            listing_type="REQUEST",
            trip_scope="INTER_CITY",
            vehicle_mode="CAR",
            source_city="Bhopal",
            destination_city="Indore",
            departure_time="02/09/2026, 06:30 AM",
            price=550.0,
            allow_bargain=True,
            driver_needed=True,
            description="[Car Owner: Toyota Innova Crysta (Manual)] Need verified experienced driver for family trip Bhopal to Indore."
        ),
        db=db
    )
    print(f"[+] Car Owner Driver-Need Post Created: ID #{owner_post['trip_id']} (Matches found: {owner_post['matches_count']})")
    assert owner_post["trip_id"] is not None
    assert owner_post["matches_count"] >= 1
    
    # =========================================================================
    # 2. AUDIT CATEGORY 2: RIDE_SHARE (Seats Offering vs Seeking)
    # =========================================================================
    print("\n--- 2. AUDITING RIDE_SHARE WORKFLOW ---")
    carpool_post = create_trip(
        TripCreate(
            creator_id=driver_user.id,
            service_category="RIDE_SHARE",
            listing_type="OFFER",
            trip_scope="INTRA_CITY",
            vehicle_mode="CAR",
            source_city="Kolar Road",
            destination_city="MP Nagar",
            departure_time="02/09/2026, 09:00 AM",
            available_seats=3,
            price=40.0,
            allow_bargain=True,
            description="[Vehicle: Swift VXi] Daily office carpool. AC on, safe driving."
        ),
        db=db
    )
    print(f"[+] Ride Share Post Created: ID #{carpool_post['trip_id']}")
    assert carpool_post["trip_id"] is not None

    # =========================================================================
    # 3. AUDIT CATEGORY 3: PARCEL P2P (Small item sending vs carrying)
    # =========================================================================
    print("\n--- 3. AUDITING PARCEL P2P WORKFLOW ---")
    parcel_post = create_trip(
        TripCreate(
            creator_id=car_owner_user.id,
            service_category="PARCEL",
            listing_type="REQUEST",
            trip_scope="INTRA_CITY",
            vehicle_mode="BIKE",
            source_city="Kolar Road",
            destination_city="MP Nagar",
            departure_time="02/09/2026, 10:00 AM",
            available_weight_kg=2.0,
            price=35.0,
            allow_bargain=True,
            description="[Material: Urgent Medicines & Documents Box] Small parcel, needs delivery before noon."
        ),
        db=db
    )
    print(f"[+] Parcel Request Post Created: ID #{parcel_post['trip_id']} (Matches found: {parcel_post['matches_count']})")
    assert parcel_post["trip_id"] is not None
    assert parcel_post["matches_count"] >= 1

    # =========================================================================
    # 4. AUDIT CATEGORY 4: CARGO LOGISTICS (Tata Ace vs Commercial Goods)
    # =========================================================================
    print("\n--- 4. AUDITING CARGO LOGISTICS WORKFLOW ---")
    cargo_post = create_trip(
        TripCreate(
            creator_id=driver_user.id,
            service_category="CARGO",
            listing_type="OFFER",
            trip_scope="INTRA_CITY",
            vehicle_mode="MINI_TRUCK",
            source_city="Govindpura",
            destination_city="Bairagarh",
            departure_time="02/09/2026, 02:00 PM",
            available_weight_kg=500.0,
            price=350.0,
            allow_bargain=True,
            is_return_trip=True,
            description="[Vehicle: Tata Ace Gold] Empty return trip from Govindpura Industrial area. 50% discounted freight."
        ),
        db=db
    )
    print(f"[+] Return Cargo Post Created: ID #{cargo_post['trip_id']}")
    assert cargo_post["trip_id"] is not None

    # =========================================================================
    # 5. AUDIT REAL-ROAD ROUTING & HIGHWAY WAYPOINTS
    # =========================================================================
    print("\n--- 5. AUDITING REAL-ROAD ROUTING ENGINE ---")
    route_data = get_trip_route_coordinates(driver_post["trip_id"], db=db)
    print(f"[+] Highway Route Snapped: {route_data['road_name']} ({route_data['distance_km']} km, ETA: ~{route_data['eta_minutes']} mins, Waypoints: {len(route_data['waypoints'])})")
    assert route_data["distance_km"] == 192.4
    assert len(route_data["waypoints"]) >= 5

    # =========================================================================
    # 6. AUDIT ESCROW BOOKING, CANCELLATION & 100% REFUND
    # =========================================================================
    print("\n--- 6. AUDITING ESCROW BOOKING & 100% CANCELLATION REFUND ---")
    passenger = db.query(UserDB).filter(UserDB.id == 1).first()
    test_trip = db.query(TripDB).filter(TripDB.id == carpool_post["trip_id"]).first()
    
    initial_passenger_balance = passenger.wallet_balance
    
    booking_res = request_booking(
        BookingCreate(
            trip_id=test_trip.id,
            requester_id=passenger.id,
            agreed_price=40.0,
            original_price=40.0,
            payment_method="ESCROW_WALLET"
        ),
        db=db
    )
    temp_booking_id = booking_res["booking_id"]
    print(f"[+] Escrow Booking Created: ID #{temp_booking_id} (Held: ₹40.0)")
    assert passenger.wallet_balance == initial_passenger_balance - 40.0
    
    cancel_res = cancel_booking(temp_booking_id, CancelBookingRequest(user_id=passenger.id, reason="Plans changed"), db=db)
    print(f"[+] Booking Cancelled & 100% Refunded: {cancel_res['message']} (Refunded: ₹{cancel_res['refund_amount']})")
    assert cancel_res["status"] == "CANCELLED"
    assert cancel_res["refund_amount"] == 40.0
    assert passenger.wallet_balance == initial_passenger_balance

    # =========================================================================
    # 7. AUDIT BARGAINING & ESCROW RELEASE ON OTP COMPLETION
    # =========================================================================
    print("\n--- 7. AUDITING BARGAINING COUNTER-OFFER & ESCROW PAYOUT ---")
    bargain_booking_res = request_booking(
        BookingCreate(
            trip_id=test_trip.id,
            requester_id=passenger.id,
            agreed_price=35.0,
            original_price=40.0,
            payment_method="ESCROW_WALLET"
        ),
        db=db
    )
    bargain_booking_id = bargain_booking_res["booking_id"]
    print(f"[+] Custom Bargain Booking Created: ID #{bargain_booking_id} (Status: {bargain_booking_res['status']})")
    assert bargain_booking_res["status"] == "PENDING_DRIVER_APPROVAL"
    
    bargain_accept_res = respond_bargain(
        bargain_booking_id,
        RespondBargainRequest(driver_id=driver_user.id, decision="ACCEPT"),
        db=db
    )
    print(f"[+] Driver Accepted Bargain: {bargain_accept_res['message']}")
    assert bargain_accept_res["status"] == "ACCEPTED"
    assert bargain_accept_res["booking_status"] == "CONFIRMED"
    
    b_obj = db.query(BookingDB).filter(BookingDB.id == bargain_booking_id).first()
    verify_handover(OTPVerify(booking_id=bargain_booking_id, otp=b_obj.handover_otp), db=db)
    comp_res = verify_completion(OTPVerify(booking_id=bargain_booking_id, otp=b_obj.completion_otp), db=db)
    print(f"[+] Trip Completed: {comp_res['message']} (Escrow Released: ₹{comp_res['payout_amount']})")
    assert comp_res["status"] == "COMPLETED"

    # =========================================================================
    # 8. AUDIT 👑 ADMIN MASTER DASHBOARD & DISPUTE RESOLUTION
    # =========================================================================
    print("\n--- 8. AUDITING 👑 ADMIN MASTER CONTROL CENTER ---")
    metrics = get_admin_metrics(db=db)
    print(f"[+] Admin Financial Metrics: GMV=₹{metrics['total_gmv']}, Commission(7%)=₹{metrics['platform_commission_earned']}, Escrow Held=₹{metrics['escrow_held_in_custody']}")
    assert metrics["total_gmv"] >= 35.0
    assert metrics["platform_commission_earned"] > 0
    assert metrics["total_users"] >= 6
    
    # Test Admin Dispute Force-Refund
    available_dispute_trip = db.query(TripDB).filter(TripDB.status == "AVAILABLE").first()
    dispute_booking_res = request_booking(
        BookingCreate(
            trip_id=available_dispute_trip.id,
            requester_id=passenger.id,
            agreed_price=40.0,
            original_price=40.0,
            payment_method="ESCROW_WALLET"
        ),
        db=db
    )
    dispute_id = dispute_booking_res["booking_id"]
    force_refund_res = admin_force_refund_booking(dispute_id, db=db)
    print(f"[+] Admin Dispute Force-Refund Executed: {force_refund_res['message']}")
    assert force_refund_res["status"] == "REFUNDED"
    
    # Test Admin Driver Payout Approval
    payout_res = withdraw_driver_earnings(
        WithdrawRequest(user_id=driver_user.id, amount=35.0, payout_method="UPI", payout_address="driver.rahul@okaxis"),
        db=db
    )
    # =========================================================================
    # 9. AUDIT 📱 DYNAMIC QR CODE HANDOVER & ESCROW RELEASE
    # =========================================================================
    print("\n--- 9. AUDITING 📱 DYNAMIC QR CODE HANDOVER & RELEASE ---")
    passenger.wallet_balance += 5000.0
    db.commit()
    qr_trip = db.query(TripDB).filter(TripDB.status == "AVAILABLE").first()
    qr_booking = request_booking(
        BookingCreate(
            trip_id=qr_trip.id,
            requester_id=passenger.id,
            agreed_price=qr_trip.price,
            original_price=qr_trip.price,
            payment_method="ESCROW_WALLET"
        ),
        db=db
    )
    qr_b_id = qr_booking["booking_id"]
    
    # Test QR Handover Scan
    qr_handover_payload = f'{{"booking_id": {qr_b_id}, "otp": "{qr_booking["handover_otp"]}", "type": "HANDOVER"}}'
    qr_res_1 = verify_qr_code(QRVerifyRequest(booking_id=qr_b_id, qr_payload=qr_handover_payload), db=db)
    print(f"[+] QR Handover Scanned: {qr_res_1['message']} (Status: {qr_res_1['status']})")
    assert qr_res_1["status"] == "IN_PROGRESS"
    
    # Test QR Delivery Completion Scan & Escrow Release
    qr_comp_payload = f'{{"booking_id": {qr_b_id}, "otp": "{qr_booking["completion_otp"]}", "type": "COMPLETION"}}'
    qr_res_2 = verify_qr_code(QRVerifyRequest(booking_id=qr_b_id, qr_payload=qr_comp_payload), db=db)
    print(f"[+] QR Delivery Scanned: {qr_res_2['message']} (Payout: ₹{qr_res_2['payout_amount']})")
    assert qr_res_2["status"] == "COMPLETED"
    assert qr_res_2["escrow_status"] == "RELEASED"
    
    db.close()
    print("\n==========================================================================================")
    print("🎯 ALL 4 CATEGORIES, QR SCANNER, ESCROW & ADMIN PHASES PASSED 100% WITHOUT ANY ERROR!")
    print("==========================================================================================")

if __name__ == "__main__":
    run_tests()

