import { useState } from "react"; // A memória do app
import { Image, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Cookie = { id: number; nome: string; preco: number; foto: any; categoria: string; ajuste?: "cover" | "contain" };
type ItemCarrinho = Cookie & { qtd: number };

const cookies : Cookie[]= [
  { id: 1, nome: "Tradicional", preco: 10, foto: require("../../assets/images/tradicional.jpeg"), categoria: "Classicos" },
  { id: 2, nome: "Red Velvet Ninho", preco: 12, foto: require("../../assets/images/red.jpeg"), categoria: "Recheados" },
  { id: 3, nome: "Nesquik", preco: 12, foto: require("../../assets/images/nesquik.jpeg"), categoria: "Especiais" },
  { id: 4, nome: "MMs", preco: 12, foto: require("../../assets/images/mm.jpeg"), categoria: "Especiais" },
  { id: 5, nome: "Black Ninho", preco: 12, foto: require("../../assets/images/black.jpeg"), categoria: "Recheados" },
  { id: 6, nome: "Doce de Leite", preco: 12, foto: require("../../assets/images/docedeleite.jpeg"), categoria: "Recheados" },
  { id: 7, nome: "Dois Amores", preco: 12, foto: require("../../assets/images/doisamores.jpeg"), categoria: "Especiais" },
  { id: 8, nome: "Matilda", preco: 12, foto: require("../../assets/images/matilda.jpeg"), categoria: "Recheados" },
];
function formatar(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function normalizar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}//isso aqui é oq iguala letra min e mai e ignora acento nas pesquisas, ajuda pra caramba

const categorias = ["Todos", "Classicos", "Recheados", "Especiais"];
//aqui é a lista de categorias, a da linha 31 é pra dizer quais opções estão selecionadas.
export default function HomeScreen() {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);//carrinho começa vazio
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);//e falso
  const [busca, setBusca] = useState("");//guarda oq o cliente digita
  const [categoria, setCategoria] = useState("Todos")//guarda a categoria selecionada e diz q já começa com "Todos" marcado
  const cookiesFiltrados = cookies.filter((c) =>
  normalizar(c.nome).includes(normalizar(busca)) &&
(categoria === "Todos" || c.categoria === categoria)
);//o filtro aqui
  function adicionar(cookie: Cookie) {
    setPedidoFinalizado(false);//falso
    setCarrinho((atual) => {
      const existe = atual.find((i) => i.id === cookie.id);
      if (existe) {
        return atual.map((i) =>
          i.id === cookie.id ? { ...i, qtd: i.qtd +1} : i);
      }
      return[...atual, {...cookie, qtd: 1}];
    });
  }
    //Até aqui é a função que adiciona o cookie no carrinho, caso ele já exista, ele só aumenta a quantidade.
function remover(id: number) {
  setCarrinho(
    (atual) =>
      atual
        .map((i) => (i.id === id ? { ...i, qtd: i.qtd - 1 } : i))
        .filter((i) => i.qtd > 0)
  );
}
const total = carrinho.reduce((soma, i) => soma + i.preco * i.qtd, 0);

function finalizar() {{/*Aqui é pra finalizar e falar com o vendedor*/}
  const linhas = carrinho.map(
    (i) => `${i.qtd}x ${i.nome} - ${formatar(i.preco * i.qtd)}`
  );
  const texto =
  "Olá, gostaria de fazer o pedido:\n\n" +
  linhas.join("\n") +
  `\n\nTotal: ${formatar(total)}`;

  Linking.openURL(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`);{/*meu zap.*/}

  setCarrinho([]);
  setPedidoFinalizado(true);
}

  return(
      <View className="flex-1">
    <Image
      source={require("../../assets/images/fundo.jpeg")}
      style={{ position: "absolute", width: "100%", height: "100%" }}
      resizeMode="cover"
    />
    <ScrollView className="flex-1 px-5">
      <View className="mt-12 mb-6">
        <Text className="text-base text-muted">Bem-vindo(a) à</Text>
        <Text className="text-4xl font-bold text-primary mt-1">
          Hora de Degustar
        </Text>
        <Text className="text-base text-muted mt-1">
          Escolha seus cookies e envie o pedido pelo WhatsApp.
  </Text>
</View>

    <Text className="text-2xl font-bold mb-4">Sabores:</Text>
      {/*<Text>Itens no carrinho: {carrinho.length}</Text>*/}
    <TextInput
    value={busca}
    onChangeText={setBusca}
    placeholder="Buscar sabor..."
    placeholderTextColor="#ffffff"
    className="bg-primary-light rounded-xl px-4 py-3 mb-4"
  />{/*Essa parte desenha a barra de pesquisa na tela */}

      <View className="flex-row flex-wrap mb-4">
      {categorias.map((c) => (
      <TouchableOpacity
        key={c}
        onPress={() => setCategoria(c)}
        className={`px-4 py-2 rounded-full mr-2 mb-2 border border-primary ${categoria === c ? "bg-white" : "bg-primary-light"//aqui faz os botões de categoria e muda a cor se estiver selecionado
        }`}
      >
        <Text className={categoria === c ? "text-primary-light font-bold" : "text-white font-bold"}>{/*Aqui eu altero a fontedos botões de categoria*/}
          {c}
        </Text>
      </TouchableOpacity>
      ))}

      </View>
      <View className="flex-row flex-wrap justify-between pb-10">
        {cookiesFiltrados.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => adicionar(item)}//"Ao tocar, ative a função adicionar"
            className="w-[48%] bg-primary-light p-3 rounded-2xl items-center mb-4"
            
          >
            <Image
              source={item.foto}
              style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 12
               }}
              resizeMode={item.ajuste ?? "cover"}
/>{/*era melhor mudar a foto  original, mas mexi aqui direto, é ruim pq deixa a foto pesada*/}
            <Text className="font-bold text-center text-white">{item.nome}</Text>
            <Text className="text-muted mt-1">{formatar(item.preco)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {cookiesFiltrados.length === 0 && (
  <Text className="text-muted mb-4">Nenhum sabor encontrado.</Text>
)}
{/*Daqui*/}
      <Text className="text-2xl font-bold mb-4">Carrinho</Text>{/*Nada de claudia aqui não, tô umas 4 horas aqui.*/}

         {carrinho.length === 0 ? (
            pedidoFinalizado? (
               <View className="bg-primary-light rounded-2xl p-5">
      <Text className="text-primary text-lg font-bold">
        Pedido realizado!
      </Text>
      <Text className="text-muted mt-1">
        Obrigado pela preferência.
      </Text>
    </View>
  ) : (
          <Text className="text-muted">Seu carrinho está vazio.</Text>
  )
        ) : (
          <View>
            {carrinho.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between bg-primary-light rounded-2xl p-4 mb-3"
              >
                <View className="flex-1">
                  <Text className="font-bold">{item.nome}</Text>
                  <Text className="text-muted">
                    {formatar(item.preco * item.qtd)} {/*calcula o preço total*/}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => remover(item.id)}
                    className="bg-white w-9 h-9 rounded-full items-center justify-center"
                  >
                    <Text className="text-primary text-xl font-bold">-</Text>
                  </TouchableOpacity>

                  <Text className="mx-3 font-bold">{item.qtd}</Text>

                  <TouchableOpacity
                    onPress={() => adicionar(item)}
                    className="bg-white w-9 h-9 rounded-full items-center justify-center"
                  >
                    <Text className="text-primary text-xl font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View className="bg-primary rounded-2xl p-5 mt-2">
              <Text className="text-white text-base">Total</Text>
              <Text className="text-white text-3xl font-bold">
                {formatar(total)}
              </Text>

              <TouchableOpacity
                onPress={finalizar}
                className="bg-white py-3 rounded-xl mt-4 items-center"
>
                <Text className="text-primary font-bold">Finalizar pedido</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setCarrinho([])}//Ao tocar vai zerar a lista carrinho
              className = "py-3 mt-3 items-center">
              <Text className="text-primary font-bold">Limpar carrinho</Text>
            </TouchableOpacity>
          </View>
        )}

      <View className="h-12" />
{/*Até aqui é a parte que mostra o carrinho, caso ele esteja vazio, ele mostra uma mensagem, caso contrário, ele mostra os itens do carrinhoe finalizar pedido*/}
    </ScrollView>
      </View>
  );
}
const WHATSAPP = "5583988001810";