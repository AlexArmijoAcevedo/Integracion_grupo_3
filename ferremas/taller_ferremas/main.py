from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS  # Para permitir peticiones desde el navegador

# Inicializar app Flask
app = Flask(__name__)
CORS(app)

# Conectar con Firebase Firestore
cred = credentials.Certificate("firebase_config.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()

# ------------------- ENDPOINTS --------------------

# GET /productos – Lista de todos los productos
@app.route('/productos', methods=['GET'])
def get_productos():
    productos_ref = db.collection('productos')
    docs = productos_ref.stream()
    productos = [{**doc.to_dict(), "id": doc.id} for doc in docs]
    return jsonify(productos), 200

# GET /productos/<codigo> – Detalle de un producto por ID
@app.route('/productos/<codigo>', methods=['GET'])
def get_producto(codigo):
    doc = db.collection('productos').document(codigo).get()
    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return jsonify({"error": "Producto no encontrado"}), 404

# GET /categorias – Lista de categorías
@app.route('/categorias', methods=['GET'])
def get_categorias():
    categorias_ref = db.collection('categorias')
    docs = categorias_ref.stream()
    categorias = [{**doc.to_dict(), "id": doc.id} for doc in docs]
    return jsonify(categorias), 200

# GET /sucursales/<id>/stock – Stock por sucursal
@app.route('/sucursales/<id>/stock', methods=['GET'])
def get_stock(id):
    stock_ref = db.collection('sucursales').document(id).collection('stock')
    docs = stock_ref.stream()
    stock = [{**doc.to_dict(), "producto_id": doc.id} for doc in docs]
    return jsonify(stock), 200

# POST /pedidos – Registrar un nuevo pedido
@app.route('/pedidos', methods=['POST'])
def post_pedido():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Datos inválidos'}), 400
    pedido_ref = db.collection('pedidos').add(data)
    return jsonify({'message': 'Pedido registrado', 'id': pedido_ref[1].id}), 201

# POST /contacto – Recibir un mensaje de contacto
@app.route('/contacto', methods=['POST'])
def post_contacto():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Datos inválidos'}), 400
    contacto_ref = db.collection('contacto').add(data)
    return jsonify({'message': 'Mensaje recibido', 'id': contacto_ref[1].id}), 201

# Ruta raíz
@app.route('/')
def home():
    return "API Flask de Ferremás funcionando 🚀"

# ------------------- EJECUCIÓN --------------------
if __name__ == '__main__':
    app.run(debug=True)