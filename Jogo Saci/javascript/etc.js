/* Biblioteca Tela, responsavel por administrar elementos fora da div do playground e o controle do mouse*/
/* Objeto é capturado do jogo e passado para o inventário de objetos na coluna de itens */
var num_objetos_inventario = 0; // invetário do jogo
var posicao_x, posicao_y, num_telas = 0;
var texto = "", face = "", face_nome="";

 // Funcao de interpretar e carregar os nos do XML
function ler(loader){ 
	var fim; // variavel que especifica o nodo que esta sendo encerrado no XML
	// ler todos os nós de um nível
	for(var i=0;i<loader.childNodes.length;i++){
		if(loader.childNodes[i].nodeName=="fim") fim = loader.childNodes[i].firstChild.nodeValue;
		// se tiver conteudo, entao ler-se o seu conteudo
		if(loader.childNodes[i].nodeType==1){
			// se for uma tela, objeto, efeito ou evento o proximo nivel entao deve carregar as permissoes para tal
			if(loader.childNodes[i].nodeName=="tela"){
				tela_t.teste = true;
				obj_t.teste = false;
				efeito_t.teste = false;
				limpar_obj_t();
				limpar_tela_t();
				limpar_evento_t();
			} else if(loader.childNodes[i].nodeName=="obj"){ // liberar permissoes dos objetos
				tela_t.teste = false;
				obj_t.teste = true;
				efeito_t.teste = false;
				limpar_obj_t();
				limpar_tela_t();
				limpar_evento_t();
			} else if(loader.childNodes[i].nodeName=="efeito" && !(evento_t.teste)){ // liberar permissoes para efeitos
				tela_t.teste = false;
				obj_t.teste = false;
				efeito_t.teste = true;
				limpar_obj_t();
				limpar_tela_t();
				limpar_evento_t();
			} else if(loader.childNodes[i].nodeName=="eventos"){
				tela_t.teste = false;
				obj_t.teste = false;
				evento_t.teste = true;
				evento_t.efeito_t.teste = false;
			} else if(loader.childNodes[i].nodeName=="titulo"){
				titulo = loader.childNodes[i].firstChild.nodeValue;
				$("h1").hide();
				$("h1").show();
			}
			
			// Leitura das telas
			if(tela_t.teste){ // se tela ainda estiver sendo lida, carregue os seus dados
				switch(loader.childNodes[i].nodeName){
					case "id":
						tela_t.id = loader.childNodes[i].firstChild.nodeValue;
						break
					case "fundo":
						tela_t.fundo=loader.childNodes[i].firstChild.nodeValue;
						break
					case "nome":
						tela_t.nome = loader.childNodes[i].firstChild.nodeValue;
						break
				}
				if(tela_t.nome=="Inicial" && tela_t.fundo!=null){
					$("#img_t").attr("src","imagens\\"+tela_t.fundo);
				}
				if(tela_t.id!=null && tela_t.fundo!=null){
					tela_t.teste = false;
					tela[tela.length] = new Tela(tela_t.id, tela_t.fundo, tela_t.nome);
					limpar_tela_t();
				}
				
			// Leitura dos objetos
			}else if(obj_t.teste){
				switch(loader.childNodes[i].nodeName){
					case "url": // local onde fica a imagem
						obj_t.url = loader.childNodes[i].firstChild.nodeValue;
						break
					case "nome":
						obj_t.nome = loader.childNodes[i].firstChild.nodeValue;
						break
					case "tipo":
						obj_t.tipo = loader.childNodes[i].firstChild.nodeValue;
						break
					case "subtipo":
						obj_t.subtipo = loader.childNodes[i].firstChild.nodeValue;
						break
					case "x":
						obj_t.x = loader.childNodes[i].firstChild.nodeValue;
						break
					case "y":
						obj_t.y = loader.childNodes[i].firstChild.nodeValue;
						break
					case "largura":
						obj_t.largura = loader.childNodes[i].firstChild.nodeValue;
						break
					case "altura":
						obj_t.altura = loader.childNodes[i].firstChild.nodeValue;
						break
					case "teleporte":
						obj_t.teleporte = loader.childNodes[i].firstChild.nodeValue;
						break
					case "delta":
						obj_t.delta = loader.childNodes[i].firstChild.nodeValue;
						break
					case "numframe":
						obj_t.numframe = loader.childNodes[i].firstChild.nodeValue;
						break
					case "rate":
						obj_t.rate = loader.childNodes[i].firstChild.nodeValue;
						break
					case "visivel":
						obj_t.visivel = loader.childNodes[i].firstChild.nodeValue;
						break
				}
	
				if(fim=="obj"){
					if(obj_t.tipo == 1){
						tela[tela.length-1].setObj(new Objeto(obj_t.url, obj_t.nome, obj_t.tipo, obj_t.subtipo, obj_t.x, obj_t.y, obj_t.largura, obj_t.altura));						
						if(obj_t.teleporte!=null){
							tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).setTeleporte(obj_t.teleporte);
						}
					}else if(obj_t.tipo == 2){
						tela[tela.length-1].setObj(new ObjetoHorA(obj_t.url,obj_t.nome,obj_t.tipo,obj_t.subtipo,obj_t.x,obj_t.y,obj_t.largura,obj_t.altura,obj_t.delta, obj_t.numframe, obj_t.rate));
					}
					
					if(obj_t.visivel=="false"){tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).setVisivel(false);};
				}
				
			// Leitura dos efeitos
			}else if(efeito_t.teste){
				if(fim=="efeito"){
					limpar_efeito_t();
				}else if(loader.childNodes[i].nodeName == "scale" || loader.childNodes[i].nodeName == "rotate" || loader.childNodes[i].nodeName == "fliph" || loader.childNodes[i].nodeName == "flipv" || loader.childNodes[i].nodeName == "visivel" ){
					efeito_t.tipo[efeito_t.tipo.length] = loader.childNodes[i].nodeName;
					efeito_t.valor[efeito_t.valor.length] = loader.childNodes[i].firstChild.nodeValue;
					tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).addEfeito(efeito_t.tipo[0], efeito_t.valor[0]);
					efeito_t.valor=new Array();
					efeito_t.tipo=new Array();
				}			
			// Leitura dos eventos
			}else if(evento_t.teste){/*alert(loader.childNodes[i].nodeName+" => "+loader.childNodes[i].firstChild.nodeValue);*/ // <eventos>
				// carregar um monte de coisas prepare-se [dados(tipo, condicao, efeito DEPOIS DEVERA TER AS DENMAIS ACOES)]
				switch(loader.childNodes[i].nodeName){
					case "tipo": // <eventos><tipo>
						evento_t.tipo = loader.childNodes[i].firstChild.nodeValue;
						break
					case "tipo_condicao":
						evento_t.tipo_condicao = loader.childNodes[i].firstChild.nodeValue;
						break
					case "nome_condicao":
						evento_t.condicao_t.nome[evento_t.condicao_t.nome.length] = loader.childNodes[i].firstChild.nodeValue;
						break
					case "estado_condicao":
						evento_t.estado_condicao = loader.childNodes[i].firstChild.nodeValue;
						break
					case "duracao":
						evento_t.duracao = loader.childNodes[i].firstChild.nodeValue;
						break
					case "senha":
						evento_t.condicao_t.senha[evento_t.condicao_t.senha.length] = loader.childNodes[i].firstChild.nodeValue;
						break
					case "efeito":
						evento_t.efeito_t.teste = true;
						break
					case "item": // caso haja um item no inventario
						evento_t.item_t.teste = true;
						break
					case "fala":
						evento_t.fala_t.teste = true;
						break
					case "chave":
						evento_t.chave_t.teste = true;
						break
					case "fim":	
						if(fim=="evento"){
							var ultima_tela = tela.length-1;
							tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).setEvento(evento_t.tipo, evento_t.tipo_condicao, ultima_tela, (tela[ultima_tela].getNumObj()-1));
							if(evento_t.estado_condicao == "false"){
								tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).getUltimoEvento().setEstado(false);
								evento_t.estado_condicao = true;
							}
							if(evento_t.condicao_t.senha.length!=0){ // verifica se a condixao possui uma senha a ser inserida
								tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).getUltimoEvento().getCondicao().setSenha(evento_t.condicao_t.senha[evento_t.condicao_t.senha.length-1]);
								//if(evento_t.tipo == "liberar_objeto") alert(evento_t.condicao_t.senha[evento_t.condicao_t.senha.length-1]);	
							}
							if(evento_t.duracao){// adiciona a duracao do evento
								tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).getUltimoEvento().setDuracao(evento_t.duracao);
								evento_t.duracao="instantaneo";
							}
						}
						break
					default:
						// alert("Erro aqui, tag: "+loader.childNodes[i].nodeName+", valor: "+loader.childNodes[i].firstChild.nodeValue);
						break
				}
				if(evento_t.tipo=="efeito"){//if(evento_t.efeito_t.teste){
					var temp = evento_t.efeito_t.tipo.length, tag_eventos = loader.childNodes[i].nodeName;
					if(tag_eventos == "scale" | tag_eventos == "rotate" | tag_eventos == "fliph" | tag_eventos == "flipv" | tag_eventos == "visivel"){
						evento_t.efeito_t.tipo[temp] = loader.childNodes[i].nodeName;
						evento_t.efeito_t.valor[temp] = loader.childNodes[i].firstChild.nodeValue;
					}else if(fim=="efeito"){
						// se o fim for do efeito deve-se adiciona-lo nos eventos
							var ultima_tela = tela.length-1;
							/** Instancia todos os dados referentes aos EFEITOS de um conjunto de eventos de um objeto.
								Em suma, ele carrega os dados da tag <eventos><tipo>efeito</tipo>...</eventos> de um objeto.
							*/
							for(var i_efeito=0;i_efeito<evento_t.efeito_t.tipo.length;i_efeito++){
								// adicionar mais um evento, na ultima tela e objeto instanciado
								// adicionar todos os efeitos dentro daquele evento
								tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).getUltimoEvento().addEfeito(evento_t.efeito_t.tipo[i_efeito], evento_t.efeito_t.valor[i_efeito]);
								// se tiver nome do objeto a ser manipulado entao adicione-o
								if(evento_t.condicao_t.nome[evento_t.condicao_t.nome.length-1]){
									// setar nome do objeto do evento
									tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).getUltimoEvento().setCondicao(evento_t.condicao_t.nome[evento_t.condicao_t.nome.length-1]);
									// setar o valor da duracao (caso exista)
									evento_t.condicao_t.nome = new Array();
								}
							}
							evento_t.efeito_t.teste = false;
							evento_t.efeito_t.tipo = new Array();
							evento_t.efeito_t.valor = new Array();
					}else if(fim=="eventos" || loader.childNodes[i].nodeName == "evento" /* adicionei aqui possivel erro nos eventos*/){
						limpar_evento_t();
					}
				}else if(evento_t.item_t.teste){ // if(evento_t.tipo=="item"){ // adicionar posteriormente este codigo
					// deve-se adicionar os dados e le-los		
					switch(loader.childNodes[i].nodeName){
						case "url":
							evento_t.item_t.url[evento_t.item_t.url.length] = loader.childNodes[i].firstChild.nodeValue;
							break
						case "nome":
							evento_t.item_t.nome[evento_t.item_t.nome.length] = loader.childNodes[i].firstChild.nodeValue;
							break
					}
					if(fim=="item"){ // carregar item
						evento_t.item_t.teste = false;
						var ultima_tela = tela.length-1;
						// adiciona itens ao evento
						tela[ultima_tela].getObj(tela[ultima_tela].getNumObj()-1).getUltimoEvento().setItem(evento_t.item_t.url[evento_t.item_t.url.length-1], evento_t.item_t.nome[evento_t.item_t.nome.length-1]);
					}
				}else if(evento_t.fala_t.teste){
					switch(loader.childNodes[i].nodeName){
						case "texto":
							evento_t.fala_t.texto[evento_t.fala_t.texto.length] = loader.childNodes[i].firstChild.nodeValue;
							break
						case "tipo_fala":
							evento_t.fala_t.tipo[evento_t.fala_t.tipo.length] = loader.childNodes[i].firstChild.nodeValue;
							break
						case "id_foto":
							evento_t.fala_t.id_foto[evento_t.fala_t.id_foto.length] = loader.childNodes[i].firstChild.nodeValue;
							break
						case "nome_foto":
							evento_t.fala_t.nome_foto[evento_t.fala_t.nome_foto.length] = loader.childNodes[i].firstChild.nodeValue;
							break
						case "url":
							evento_t.fala_t.url[evento_t.fala_t.url.length] = loader.childNodes[i].firstChild.nodeValue;
							break
					}
					
					if(fim == "fala"){
						for(var j = 0; j < evento_t.fala_t.tipo.length; j++) // adicionar falas
						{
							tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).getUltimoEvento().setFala(evento_t.fala_t.texto[j], evento_t.fala_t.tipo[j], evento_t.fala_t.id_foto[j], evento_t.fala_t.nome_foto[j], evento_t.fala_t.url[j]);
						}
						evento_t.fala_t.teste=false;
						limpar_evento_t_u();
					}
				}else if(evento_t.chave_t.teste){
					switch(loader.childNodes[i].nodeName){
						case "chave":
							evento_t.chave_t.chave[evento_t.chave_t.chave.length] = loader.childNodes[i].firstChild.nodeValue;
							break
					}
					if(fim == "chave"){
						for(var contChave=0;contChave<evento_t.chave_t.chave.length;contChave++)
							tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).getUltimoEvento().setChave(new Array(evento_t.chave_t.chave[contChave]));
						}
				}else if(evento_t.tipo == "liberar_objeto" && fim=="evento"){
					tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).getUltimoEvento().setObjID(new Number(tela[tela.length-1].getNumObj()-1));
					tela[tela.length-1].getObj(tela[tela.length-1].getNumObj()-1).getUltimoEvento().setTelaID(new Number(tela.length)-1);
					fim=null;
				}
				
				if(fim=="eventos"){
					limpar_evento_t();
				}
			}
		}
		ler(loader.childNodes[i]);
	}
}

/**
	Demais funcoes do jogo
*/
/* Registro de clique */
function onClick(ev){
	var fundo = document.getElementById("camada");
	var fundo_topo = $.playground().offset().top, fundo_largura = fundo.offsetWidth, fundo_altura = fundo.offsetHeight, fundo_margin_left = $.playground().offset().left;
	posicao_x = fundo_largura - ev.clientX - 1;
	posicao_y = fundo_altura - (ev.clientY + 52);
	alert("X: " + posicao_x + ", Y: " + posicao_y);
};

/* Carregar dados do XML */
function xmlConectar(arquivo){
	arquivo = './XML/'+ arquivo;
	if(window.XMLHttpRequest){
		var Loader = new XMLHttpRequest();
		Loader.open("GET", arquivo, false);
		Loader.send(null);
		return Loader.responseXML;
	}else if(window.ActiveXObject){
		var Loader = new ActiveXObject("Msxml2.DOMDocument.3.0");
		Loader.async = false;
		Loader.load(arquivo);
		return Loader;
	};
};


// Veridicar se ha elemento repetido no vetor
function comparar(valor, vetor){
	for(var i=0;i<vetor.length;i++){
		if(teste && vetor[i]==valor){
			return true;// se o vetor contiver um valor igual
		}
	}
	return false;// se o vetor contiver um valor diferente
}

function ajustar(){
	tela_width = 0.59*document.body.clientWidth;
	tela_height = 0.59*screen.availHeight;
	prop_width = document.body.clientWidth/1024;
	prop_height = screen.availHeight/734;
	$(".corpo").css("min-height",0.59*screen.availHeight);
	$(".saida").css("margin-top",(0.59*screen.availHeight+20));
};