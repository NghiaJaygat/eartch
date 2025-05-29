def kiem_tra_thoi_gian(time_str):
    try:
        parts = time_str.split(":")
        if len(parts) != 3:
            return "Không hợp lệ!"
        
        hh, mm, ss = map(int, parts)
        
        if 0 <= hh <= 23 and 0 <= mm <= 59 and 0 <= ss <= 59:
            return "Hợp lệ!"
        else:
            return "Không hợp lệ!"
    except:
        return "Không hợp lệ!"

thoi_gian = input("Nhập thời gian (hh:mm:ss): ")
ket_qua = kiem_tra_thoi_gian(thoi_gian)
print(ket_qua)
