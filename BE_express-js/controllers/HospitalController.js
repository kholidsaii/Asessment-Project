// class HospitalController{
//     index(req, res){
//         const data ={
//             message: "Menampilkan semua data",
//             data:[],
//         };
//         res.json(data);
//     }
//     store(req, res){
//         res.send("Menambahkan semua Rumah Sakit")
//     }
//     update(req, res){
//         const {id} = req.params;
//         res.send(`Mengubah data Rumah Sakit ${id}`)
//     }
//     destroy(req, res){
//         const {id} = req.params;
//         res.send(`Menghapus data Rumah Sakit ${id}`)
//     }
// }

// const objects = new HospitalController();

// module.exports = objects;

const prisma = require("../prisma/client");

class HospitalController {

    async index(req, res) {
        try {
            const { name, code, class: hospitalClass } = req.query;

            const hospitals = await prisma.hospital.findMany({
                where: {
                    name: name ? { contains: name } : undefined,
                    code: code ? { contains: code } : undefined,
                    class: hospitalClass ? hospitalClass : undefined
                }
            });

            res.json(hospitals);
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async store(req, res) {
        try {
            const { name, code, class: hospitalClass } = req.body;

            if (!name || !code || !hospitalClass) {
                return res.status(400).json({
                    message: "Semua field wajib diisi"
                });
            }

            const hospital = await prisma.hospital.create({
                data: {
                    name,
                    code,
                    class: hospitalClass
                }
            });

            res.json(hospital);
        } catch (error) {
            if (error.code === "P2002") {
                return res.status(400).json({
                    message: "Code sudah digunakan"
                });
            }

            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, code, class: hospitalClass } = req.body;

            const hospital = await prisma.hospital.update({
                where: { id: Number(id) },
                data: {
                    name,
                    code,
                    class: hospitalClass
                }
            });

            res.json(hospital);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;

            await prisma.hospital.delete({
                where: { id: Number(id) }
            });

            res.json({ message: "Deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async show(req, res) {
        const { id } = req.params;

        const hospital = await prisma.hospital.findUnique({
            where: { id: Number(id) }
        });

        res.json(hospital);
    }
}

module.exports = new HospitalController();