from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Conexión con Firestore
cred = credentials.Certificate("../ferremas-cb091-firebase-adminsdk-fbsvc-f48d4e18b3.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ------------------- ENDPOINTS --------------------

# GET /productos – Lista de todos los productos
@app.route('/productos', methods=['GET'])
def get_productos():
    try:
        print("Accediendo a Firestore...")
        productos_ref = db.collection('productos')
        docs = productos_ref.stream()
        productos = [{**doc.to_dict(), "id": doc.id} for doc in docs]
        print("Productos obtenidos correctamente")
        return jsonify(productos), 200
    except Exception as e:
        print(f"Error en /productos: {e}")
        return jsonify({'error': 'Error al obtener productos'}), 500

# GET /productos/<codigo> – Detalle de un producto por código
@app.route('/productos/<codigo>', methods=['GET'])
def get_producto(codigo):
    productos_ref = db.collection('productos').where('codigo', '==', codigo).limit(1).stream()
    producto = next(productos_ref, None)
    if producto:
        return jsonify(producto.to_dict()), 200
    else:
        return jsonify({"error": "Producto no encontrado"}), 404

# GET /categorias – Lista de categorías únicas extraídas desde productos
@app.route('/categorias', methods=['GET'])
def get_categorias():
    productos_ref = db.collection('productos')
    docs = productos_ref.stream()
    categorias = sorted({doc.to_dict().get('categoria', '') for doc in docs})
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


#Convertir moneda
#/moneda/convertir?monto=10000&desde=CLP&hacia=USD (path del pointend)
@app.route('/moneda/convertir', methods=['GET'])
def convertir_moneda():
    # Obtener parámetros de consulta
    monto = request.args.get('monto', type=float)
    desde = request.args.get('desde', default='CLP').upper()
    hacia = request.args.get('hacia', default='USD').upper()

    if not monto or desde not in ['CLP', 'USD'] or hacia not in ['CLP', 'USD']:
        return jsonify({'error': 'Parámetros inválidos. Uso: ?monto=1000&desde=CLP&hacia=USD'}), 400

    try:
        # Llamada a la API de mindicador.cl
        response = requests.get("https://mindicador.cl/api")
        response.raise_for_status()
        data = response.json()

        valor_dolar = data['dolar']['valor']

        if desde == 'CLP' and hacia == 'USD':
            resultado = monto / valor_dolar
        elif desde == 'USD' and hacia == 'CLP':
            resultado = monto * valor_dolar
        else:
            resultado = monto  # mismo tipo de moneda

        return jsonify({
            'monto_original': monto,
            'desde': desde,
            'hacia': hacia,
            'resultado': round(resultado, 2),
            'valor_dolar': valor_dolar,
            'fecha': data['dolar']['fecha']
        })

    except requests.RequestException:
        return jsonify({'error': 'No se pudo obtener la información del valor del dólar'}), 500



# Ruta raíz
@app.route('/')
def home():
    return "API Flask de Ferremás funcionando"

if __name__ == '__main__':
    app.run(debug=True)