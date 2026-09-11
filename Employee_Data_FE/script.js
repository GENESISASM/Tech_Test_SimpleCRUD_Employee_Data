const API_URL = "http://localhost:8080/api/employees";
let isEditMode = false;

$(document).ready(function () {
    loadData();
    $("#searchInput").on("keyup", function () {
        searchData();
    });
});

function loadData() {
    $.ajax({
        url: API_URL,
        type: "GET",
        success: function (response) {
            let html = "";
            response.forEach((emp, index) => {
                // Hitung umur dari tanggal lahir
                let birthDate = new Date(emp.dateOfBirth);
                let ageDifMs = Date.now() - birthDate.getTime();
                let ageDate = new Date(ageDifMs);
                let age = Math.abs(ageDate.getUTCFullYear() - 1970);

                html += `<tr>
                            <td>${index + 1}</td>
                            <td>${emp.id}</td>
                            <td>${emp.name}</td>
                            <td>${age}</td>
                            <td>${emp.dateOfBirth}</td>
                            <td>${emp.gender}</td>
                            <td>${emp.address}</td>
                            <td>${emp.nationality}</td>
                            <td>
                                <button class="btn btn-sm btn-info text-white" onclick="detailData(${emp.id})">Detail</button>
                                <button class="btn btn-sm btn-warning text-white" onclick="editData(${emp.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteData(${emp.id}, '${emp.name}')">Delete</button>
                            </td>
                        </tr>`;
            });
            $("#table-body").html(html);
        },
        error: function () {
            alert("Gagal mengambil data dari server. Pastikan Backend Java menyala.");
        }
    });
}

function searchData() {
    let keyword = $("#searchInput").val().toLowerCase().trim();

    $("#table-body tr").each(function () {
        let nik = $(this).find("td:eq(1)").text().toLowerCase();
        let name = $(this).find("td:eq(2)").text().toLowerCase();

        if (nik.includes(keyword) || name.includes(keyword)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function saveData() {
    let payload = {
        id: $("#nik").val(),
        name: $("#name").val(),
        gender: $("input[name='gender']:checked").val(),
        dateOfBirth: $("#dob").val(),
        address: $("#address").val(),
        nationality: $("#nationality").val()
    };

    if (!payload.id || !payload.name || !payload.gender || !payload.dateOfBirth) {
        alert("Harap lengkapi semua data wajib!");
        return;
    }

    let type = isEditMode ? "PUT" : "POST";
    let url = isEditMode ? `${API_URL}/${$("#originalId").val()}` : API_URL;

    $.ajax({
        url: url,
        type: type,
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function () {
            alert("Data berhasil disimpan!");
            showMonitoring();
            loadData();
        },
        error: function () {
            alert("Gagal menyimpan data. Pastikan NIK belum digunakan (Jika tambah data baru).");
        }
    });
}

function deleteData(id, name) {
    if (confirm(`Anda yakin menghapus data ${name} ?`)) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "DELETE",
            success: function () {
                alert("Data berhasil dihapus!");
                loadData();
            }
        });
    }
}

function editData(id) {
    $.get(`${API_URL}/${id}`, function (emp) {
        isEditMode = true;
        $("#form-title").text("Edit Data Karyawan");
        $("#originalId").val(emp.id);
        $("#nik").val(emp.id);
        $("#nik").prop("readonly", true);

        $("#name").val(emp.name);
        if (emp.gender === "Laki-laki") $("#genderL").prop("checked", true);
        if (emp.gender === "Perempuan") $("#genderP").prop("checked", true);
        $("#dob").val(emp.dateOfBirth);
        $("#address").val(emp.address);
        $("#nationality").val(emp.nationality);

        enableForm();
        $("#form-section").fadeIn();
        $("#monitoring-section").hide();
    });
}

function detailData(id) {
    editData(id);
    setTimeout(() => {
        $("#form-title").text("Detail Data Karyawan");
        disableForm();
        $("#btnSave").hide();
    }, 100);
}

function showMonitoring() {
    $("#form-section").hide();
    $("#monitoring-section").fadeIn();
}

function showAddForm() {
    isEditMode = false;
    $("#form-title").text("Tambah Data Baru");
    $("#employeeForm")[0].reset();
    $("#nik").prop("readonly", false);
    enableForm();

    $("#form-section").fadeIn();
    $("#monitoring-section").hide();
}

function disableForm() {
    $("#employeeForm input, #employeeForm textarea, #employeeForm select").prop("disabled", true);
}

function enableForm() {
    $("#employeeForm input, #employeeForm textarea, #employeeForm select").prop("disabled", false);
    $("#btnSave").show();
}