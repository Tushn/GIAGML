/* JavaScript, carregar qu	alquer jogo */
var tela = new Array(), objetos = new Array(), eventos = new Array(), chaves = new Array(), id_tela_atual = 0; 
var loader;

// Recursos que definem as variaveis da tela (dimensoes), alem da classe que define a tela e seus objetos
var tela_width = 100, tela_height = 820, prop_width = 1, prop_height = 1;

// Informcoes de personalizacao
var titulo = ""

$(function(){
	ajustar();
	loader = xmlConectar("jogo_amigos.xml");
	ler(loader);
	tela[0].mostrar();
	
	if(titulo!="") $(".titulo").html("<h1>"+titulo+"</h1>");
	
	$("#playground").click(function(){
		$("#iniciar").hide();
		$.playground().startGame(function(){}); // Inicializar jogo
	});
});