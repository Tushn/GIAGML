/* Local para armazenar  variaveis da leitura do XML e as funcoes que as limpam */
/* tela_t e obj_t: estrutura que guarda os valores usados para carregar as telas e dos objetos, 
respectivamentedo, do XML de forma temporaria.
*/
var tela_t = {
	teste: false,
	fundo: null,
	id: null,
	tela: null
}, obj_t = {
	teste: false,
	url: null,
	nome: null,
	tipo: null,
	subtipo: null,
	x: null,
	y: null,
	largura: null,
	altura: null,
	teleporte: null,
	delta: null,
	numframe: null,
	rate: null,
	visivel: true
},efeito_t = {
	teste: false,
	tipo: new Array(),
	valor: new Array(),
},evento_t = {
	teste: false,
	tipo: new Array(),
	tipo_condicao: new Array(),
	duracao: new Array(),
	estado_condicao: true,
	condicao_t: {
		nome:  new Array(),
		tipo:  new Array(),
		senha:  new Array(),
	},
	efeito_t: {
		teste: false,
		tipo: new Array(),
		valor: new Array()
	},
	item_t: {
		teste: false,
		url: new Array(),
		nome: new Array(),
	},
	fala_t: {
		teste: false,
		texto: new Array(),
		tipo: new Array(),
		id_foto: new Array(),
		nome_foto: new Array(),
		url: new Array()
	},
	chave_t: {
		teste: false,
		chave: new Array()
	},
};

/**
	A seguir funcoes que manipulam as variaveis globais ligadas a consulta do XML
*/
// limpar dados que carregam as telas
function limpar_tela_t(){
	tela_t.fundo = null;
	tela_t.id = null;
	tela_t.nome = null;
}

// Funcao responsavel por limpar a estrutura dos objetos
function limpar_obj_t(){
	obj_t.url = null;
	obj_t.nome = null;
	obj_t.tipo = null;
	obj_t.subtipo = null;
	obj_t.x = null;
	obj_t.y = null;
	obj_t.largura = null;
	obj_t.altura = null;
	obj_t.teleporte = null;
	obj_t.visivel = true;
	obj_t.delta = null;
	obj_t.numframe = null;
	obj_t.rate = null;
}

// limpar dados dos efeitos
function limpar_efeito_t(){
	efeito_t.teste = false;
	efeito_t.tipo = new Array();
	efeito_t.valor = new Array();
}

// limpar dados dos eventos
function limpar_evento_t(){
	evento_t.teste = false;
	limpar_evento_t_u();
}

function limpar_evento_t_u(){
	evento_t.tipo = new Array();
	evento_t.tipo_condicao = new Array();
	evento_t.estado_condicao = true;
	/* Efeitos dos eventos*/
		evento_t.efeito_t.teste = false;
		evento_t.efeito_t.tipo = new Array();
		evento_t.efeito_t.valor = new Array();
		evento_t.duracao = null;
	/* Chave */
		evento_t.chave_t.teste = false;
		evento_t.chave_t.chave = new Array();
	/* Falas */
		limpar_evento_fala();
}

function limpar_evento_fala(){
	/* Falas */
	evento_t.fala_t.teste = false;
	evento_t.fala_t.texto = new Array();
	evento_t.fala_t.tipo = new Array();
	evento_t.fala_t.id_foto = new Array();
	evento_t.fala_t.nome_foto = new Array();
	evento_t.fala_t.url = new Array();
}
	

function limpar_condicao(){
	evento_t.tipo_condicao = new Array();
	evento_t.condicao_t.nome =  new Array();
	evento_t.condicao_t.tipo =  new Array();
	evento_t.condicao_t.senha =  new Array();
}