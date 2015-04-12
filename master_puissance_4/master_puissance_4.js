/******************************************************************************
Name:    Master Puissance 4
Version: 1.1 (March 05 2010)
Author:  Zennaro Julien

Licence:
Master Puissance 4 is licensed under a Creative Commons Attribution-NonCommercial 2.5
License (http://creativecommons.org/licenses/by-nc/2.5/).

You are free:
	* to copy, distribute, display, and perform the work
	* to make derivative works

Under the following conditions:
	* Attribution. You must attribute the work in the manner  specified by  the
	  author or licensor.
	* Noncommercial. You may not use this work for commercial purposes.

* For  any  reuse  or  distribution, you  must make clear to others the license
  terms of this work.
* Any  of  these  conditions  can  be  waived  if  you  get permission from the 
  copyright holder.

Your fair use and other rights are in no way affected by the above.
******************************************************************************/
(function () {
	
	var fn_onload_puiss4 = function ()
	{
		//héritage
		jz.extend(jz, {
			
			//----------------------------------------------
			// Lance le constructeur de puiss4
			//----------------------------------------------
			new_puiss4 : function ()
			{
				var fp = jz.$("form_puiss4");
				var opt = {
				
					nbr : 			jz.puiss4G.length,
					ligne: 			fp.elements["ligne"].value,
					colonne : 		fp.elements["colonne"].value,
					joueur1 : 		fp.elements["joueur1"].value,
					joueur2 : 		fp.elements["joueur2"].value,
					difficulte : 	fp.elements["difficulte"].value,
					agressivite : 	fp.elements["agressivite"].value
				};
				jz.puiss4G.push(new jz.puiss4(opt)); //lance une nouvelle instance de puiss4
			},
			
			puiss4G : [],  //conteneur des instances de puiss4

			//----------------------------------------------
			// Constructeur de puiss4
			//----------------------------------------------			
			puiss4 : function (arg)
			{
				//----------------------------------------------
				// Paramètres
				//----------------------------------------------					
				this.nbr = arg.nbr;		//n° de l'instance de puiss4
				this.joueur_actif = 1;
				this.joueur = [];		
				this.joueur[1] =	(arg.joueur1 == 2) ? 							"IA" : "humain";
				this.joueur[2] =	(arg.joueur2 == 1) ? 							"humain" : "IA";
				this.nbr_ligne = 	(arg.ligne == parseInt(arg.ligne)) ? 			parseInt(arg.ligne) : 6;
				this.nbr_colonne = 	(arg.colonne == parseInt(arg.colonne)) ? 		parseInt(arg.colonne) : 7;
				this.IA = 			(arg.IA == parseInt(arg.IA)) ? 					parseInt(arg.IA) : 1;
				this.difficulte =	(arg.difficulte < 7 && arg.difficulte > 0) ? 	parseInt(arg.difficulte) : 5;				
				this.agressivite = 	(arg.agressivite == 1) ? 2 :
									(arg.agressivite == 2) ? 1 :
									(arg.agressivite == 4) ? 0.3 : 0.5;
				
				if(this.difficulte > 5)
				{
					if(!confirm("Attention, avec le niveau de difficulté fixé à 6 le jeu peut être ralentit.\nIl se peut même que vous ayez un message vous demandant confirmation pour continuer.\n\nContinuer?"))
					{
						return false;
					}
				}
				this.seuil_gagner = parseInt(1000 * this.agressivite);
				this.partie_finie = false;
				
				if(this.nbr_colonne > 11 || this.nbr_ligne > 7)
				{
					this.taille_pion = "69";
					document.body.style.background = "#000"; //plateau trop grand pour un fond qui se répète
				}
				else this.taille_pion = "98";
				
				//----------------------------------------------
				// Création du plateau de jeu
				//----------------------------------------------
				jz.include("css/tablejeu_" + this.taille_pion + ".css"); //inclus le .css approprié
				
				this.table_jeu = [];
				this.table_el = [];
				var largeur = (this.nbr_colonne * this.taille_pion);
				
				var div_main = document.createElement("div");			//main
				div_main.setAttribute("id", "main");
				div_main.style.width = largeur + "px";
				div_main.style.marginLeft = (largeur/2 * -1) + "px";
				div_main.style.left = "50%";
				//----------------------------------------------
				
					var div_tir = document.createElement("div");		//main > zone de tir
					div_tir.setAttribute("id", "zone-de-tir");
					div_tir.style.width = largeur + "px";
					
					for(var col = 0; col < this.nbr_colonne; col++)
					{
						var div_in = document.createElement("div");						
						div_tir.appendChild(div_in);
						
						//----------------------------------------------
						// Placement des évènements
						//----------------------------------------------
						div_in.className = "tir" + col;
						jz.addev(div_in, "mouseover", 	function (ev) {return jz.puiss4G[arg.nbr].mouseover(ev);});
						jz.addev(div_in, "mouseout", 	function (ev) {return jz.puiss4G[arg.nbr].mouseout(ev);});
						jz.addev(div_in, "click", 		function (ev) {return jz.puiss4G[arg.nbr].click(ev);});
					}
					div_main.appendChild(div_tir);
					//----------------------------------------------
					
					var ntab = document.createElement("table");			//main > tableau-jeu
					ntab.setAttribute("id","tableau-jeu");
					ntab.setAttribute("cellpadding","0");
					ntab.setAttribute("cellspacing","0");
					ntab.style.width = largeur + "px";
					
					for(var row = 0; row < this.nbr_ligne; row++)
					{
						var tr = ntab.insertRow(row);
						
						for(var col = 0; col < this.nbr_colonne; col++)
						{
							var td = tr.insertCell(col);									
							tr.appendChild(td);
							
							//----------------------------------------------
							// Placement des évènements
							//----------------------------------------------
							td.className = "tir" + col;
							jz.addev(td, "mouseover", 	function (ev) {return jz.puiss4G[arg.nbr].mouseover(ev);});
							jz.addev(td, "mouseout", 	function (ev) {return jz.puiss4G[arg.nbr].mouseout(ev);});
							jz.addev(td, "click", 		function (ev) {return jz.puiss4G[arg.nbr].click(ev);});
							
							//----------------------------------------------
							// Création d'un array correspondant au plateau
							//----------------------------------------------
							if(typeof this.table_jeu[col] == "undefined") this.table_jeu[col] = [];
							this.table_jeu[col][this.nbr_ligne - row - 1] = false;
							this.table_el[col + "-" + (this.nbr_ligne - row - 1)] = td;
						}
					}
					div_main.appendChild(ntab);

				//----------------------------------------------
				// Lancement effectif du jeu
				//----------------------------------------------
				jz.$("starter").style.display = "none";					//cache les options
				document.body.appendChild(div_main);					//affiche le jeu	
				
				if(this.joueur[1] == "IA") setTimeout("jz.puiss4G[" + this.nbr + "].tour_IA()", 100);
			}
		});
	
		jz.puiss4.prototype = {
			
			//----------------------------------------------
			// Renvois l'élément de la zone-de-tir appartenant
			// à la colonne ayant déclanché l'évenement
			//----------------------------------------------
			get_zone_tir : function (ev)
			{			
				return jz.$("zone-de-tir", "div")[jz.ev_target(ev).className.substring(3,4)];
			},
			
			//----------------------------------------------
			// Rollver (de la zone de tir)
			//----------------------------------------------
			mouseover : function (ev)
			{
				if(this.joueur[this.joueur_actif] == "IA" || this.partie_finie) return;
				
				this.get_zone_tir(ev).style.background =
				"transparent url(img/pion_" + this.taille_pion + "/pion_vide_hover" + this.joueur_actif + ".png) no-repeat scroll left top";
			},
			
			mouseout : function (ev)
			{
				this.get_zone_tir(ev).style.background =
				"transparent url(img/pion_" + this.taille_pion + "/pion_vide.png) no-repeat scroll left top";
			},
			
			//----------------------------------------------
			// Click effectué pour placer un pion
			//----------------------------------------------
			click : function (ev)
			{
				if(this.joueur[this.joueur_actif] == "IA" || this.partie_finie) return;
				
				var colonne = jz.ev_target(ev).className.substring(3,4);

				if(this.placer_pion(colonne, this.joueur_actif))
				{
					if(this.joueur[this.joueur_actif] == "IA")
					{
						setTimeout("jz.puiss4G[" + this.nbr + "].tour_IA()", 100); //lance l'IA
					}
					else this.mouseover(ev); //change le pion survolé
				}	
			},
			
			//----------------------------------------------
			// Fonction de placement d'un pion
			//----------------------------------------------
			placer_pion : function(colonne, joueur)
			{
				for(var cp1 = 0; cp1 < this.nbr_ligne ; cp1++)
				{
					if(!this.table_jeu[colonne][cp1])
					{
						var decoupe = this.branche_decoupe(this.table_jeu, colonne);						
						var result_gagner = this.branche_calcule(decoupe, colonne, joueur, true); //gagner?
												
						this.table_jeu[colonne][cp1] = joueur;				
						this.table_el[colonne + "-" + cp1].style.background = "transparent url(img/pion_" + this.taille_pion + "/pion" + joueur + ".png) no-repeat scroll left top";
						this.joueur_actif = (this.joueur_actif == 1) ? 2 : 1;
						
						if(result_gagner)
						{
							this.gagner(joueur);
							return false;
						}
						return true;
					}
				}
				return false;
			},	
			
			//----------------------------------------------
			// Un joueur à gagné
			//----------------------------------------------	
			gagner : function(joueur)
			{
				this.partie_finie = true;
				alert("CONGRATULATION\nLe joueur " + joueur + " a gagner la partie!");
			},
			
			//----------------------------------------------
			// Tour de l'IA
			//----------------------------------------------
			tour_IA : function ()
			{								
				var poss = this.arbre_des_possibilites(this.table_jeu, this.joueur_actif, (this.joueur.length - 1), 1, this.difficulte)
				var colonne_a_jouer = poss[this.joueur_actif].best_colonne;				
				
				if(this.placer_pion(colonne_a_jouer, this.joueur_actif))
				{									
					if(this.joueur[this.joueur_actif] == "IA") //IA contre IA
					{
						setTimeout("jz.puiss4G[" + this.nbr + "].tour_IA()", 500);
					}
				}
			},

			//----------------------------------------------
			// Arbre des coups possibles   (<!> récursif)
			//----------------------------------------------
			arbre_des_possibilites : function (table_jeuG, joueur_actifG, joueurs_totG, niveau_actifG, niveau_totG)
			{
				var zjoueur = [];
				zjoueur[joueur_actifG] = {colonne : []};
				
				var best =
				{
					point : "",
					colonne : []
				};
				
				//----------------------------------------------
				//considère que joueur_actifG joue dans la colonne ccp
				//----------------------------------------------						
				for(var t_ccp = 0; t_ccp < this.nbr_colonne; t_ccp++) //colonne jouée
				{
					if(!table_jeuG[t_ccp][this.nbr_ligne - 1])	 //un coup est possible dans cette colonne (dernier emplacement de cette colonne libre)
					{
						zjoueur[joueur_actifG].colonne[t_ccp] = {gain : 0, perte : 0};
						
						//----------------------------------------------
						//calcul des points du joueur jcp
						//----------------------------------------------
						var decoupe = this.branche_decoupe(table_jeuG, t_ccp);

						for(var jcp = 1; jcp <= joueurs_totG; jcp++)
						{
							var result_point = this.branche_calcule(decoupe, t_ccp, jcp, false);
							
							if(jcp == joueur_actifG)	{zjoueur[joueur_actifG].colonne[t_ccp].gain = result_point;}
							else 						{zjoueur[joueur_actifG].colonne[t_ccp].perte += result_point * this.agressivite;}
						}

						zjoueur[joueur_actifG].colonne[t_ccp].tot = (zjoueur[joueur_actifG].colonne[t_ccp].gain + zjoueur[joueur_actifG].colonne[t_ccp].perte);
						
						//----------------------------------------------
						//passe au tour suivant
						//----------------------------------------------
						if(	niveau_actifG < niveau_totG &&
							zjoueur[joueur_actifG].colonne[t_ccp].gain < this.seuil_gagner) //si on gagne on s'en fou de ce que l'autre pourrait faire après
						{
							var joueur_actif_tps = (joueur_actifG < joueurs_totG) ? (joueur_actifG  + 1) : 1;

							//----------------------------------------------
							//copie sans référence de table_jeuG
							//----------------------------------------------							
							var table_jeu_tps = [];

							for(var tcp1 = 0; tcp1 < this.nbr_colonne; tcp1++)
							{
								table_jeu_tps[tcp1] = [];

								for(var tcp2 = 0; tcp2 < this.nbr_ligne; tcp2++)
								{
									table_jeu_tps[tcp1][tcp2] = table_jeuG[tcp1][tcp2];
								}
							}
							//----------------------------------------------
							//place le jeton de joueur_actifG dans la colonne t_ccp
							//----------------------------------------------
							for(var l_ccp = 0; l_ccp < this.nbr_ligne; l_ccp++)
							{
								if(!table_jeu_tps[t_ccp][l_ccp])
								{
									table_jeu_tps[t_ccp][l_ccp] = joueur_actifG;									
									break;
								}
							}
							//----------------------------------------------
							//test la réponse de l'adversaire à ce coup
							//----------------------------------------------
							zjoueur[joueur_actifG].colonne[t_ccp].zjoueur = 
								this.arbre_des_possibilites(table_jeu_tps, joueur_actif_tps, joueurs_totG, (niveau_actifG + 1), niveau_totG)
							
							zjoueur[joueur_actifG].colonne[t_ccp].tot -= zjoueur[joueur_actifG].colonne[t_ccp].zjoueur[joueur_actif_tps].best_point;		
						}
						//----------------------------------------------
						// détermine la meilleurs colonnes ou jouer
						// POUR le joueur qui jouera à ce tour
						//----------------------------------------------
						if(best.point == "" || best.point < zjoueur[joueur_actifG].colonne[t_ccp].tot)
						{
							best.point = zjoueur[joueur_actifG].colonne[t_ccp].tot;
							best.colonne = [t_ccp];
						}
						else if (best.point == zjoueur[joueur_actifG].colonne[t_ccp].tot)
						{
							best.colonne.push(t_ccp);
						}
					}
				}				
				//----------------------------------------------
				//tire au hasard une des colonnes impartagable précédemment
				//----------------------------------------------
				if(best.colonne.length > 1)
				{
					best.colonne = [best.colonne[jz.ale(0, best.colonne.length-1)]];
				}
				//NE GARDE QUE L'ESSENTIEL (plus lent !) - zjoueur[joueur_actifG] = {best_point : best.point, best_colonne : best.colonne[0]};
				
				zjoueur[joueur_actifG].best_point = best.point;
				zjoueur[joueur_actifG].best_colonne = best.colonne[0];
						
				return zjoueur;				
			},
			
			//----------------------------------------------
			// Calcule de la ligne jouée
			//----------------------------------------------
			calcule_ligne_jouer : function (table_jeu, colonne_jouer)
			{
				for(var xcp = 0; xcp < this.nbr_ligne; xcp++) //ligne
				{
					if(!table_jeu[colonne_jouer][xcp])
					{
						return xcp;
					}
				}
				return false;
			},

			//----------------------------------------------
			// Decoupe des différentes directions
			// à partir l'emplacement joué
			//----------------------------------------------
			branche_decoupe : function (table_jeu, colonne_jouer)
			{				
				var ligne_jouer = this.calcule_ligne_jouer(table_jeu, colonne_jouer);
				var diagonaleBG = [0];
				var diagonaleHG = [0];
				var horizontal = [0];
				var vertical = [0];

				//----------------------------------------------
				// passe en revue toute les cases
				//----------------------------------------------
				for(var ccp = 0; ccp < this.nbr_colonne; ccp++) 					//ccp = colonne compteur
				{										
					var diff_col = (colonne_jouer - ccp);
					var ABS_diff_col = Math.abs(diff_col);
					
					for(var lcp = 0; lcp < this.nbr_ligne; lcp++) 			//lcp = ligne compteur
					{
						if(lcp == ligne_jouer && ccp == colonne_jouer) 							//emplacement joué, l'ajoute à toute les combinaisons
						{						
							diagonaleBG[0] = (diagonaleBG.length);
							diagonaleHG[0] = (diagonaleHG.length);
							horizontal[0] = (horizontal.length);
							vertical[0] = (vertical.length);
						}
						else
						{	var diff_lig = (ligne_jouer - lcp);
							var ABS_diff_lig = Math.abs(diff_lig);
	
							//----------------------------------------------
							// découpe des DIAGONALES
							//----------------------------------------------
							if(ABS_diff_col == ABS_diff_lig && (ABS_diff_col + 1) <= 4)			//fait partie d'une diagonale ET influence possible
							{							
								(diff_col == diff_lig) ? 	diagonaleBG.push([ccp, table_jeu[ccp][lcp]]) : //fait partie de la diagonale bas gauche - haut droite
															diagonaleHG.push([ccp, table_jeu[ccp][lcp]]);  //fait partie de la diagonale haut gauche - bas droite
								continue;
							}
							//----------------------------------------------
							// découpe de la VERTICAL
							//----------------------------------------------
							if(lcp == ligne_jouer && (ABS_diff_col + 1) <= 4)					//ligne (hypothétique) jouée ET influence possible
							{							
								vertical.push([ccp, table_jeu[ccp][lcp]]);
								continue;
							}
							//----------------------------------------------
							// découpe de l'HORIZONTAL
							//----------------------------------------------
							if(ccp == colonne_jouer && (ABS_diff_lig + 1) <= 4)	 				//colonne (hypothétique) jouée ET influence possible
							{
								horizontal.push([ccp, table_jeu[ccp][lcp]]);
								continue;
							}
						}
					}
				}
				return [diagonaleBG, diagonaleHG, horizontal, vertical];
			},
								
			//----------------------------------------------
			// Calcule des gains d'un joueur
			// pour un coup donné d'un joueur donné
			//----------------------------------------------
			branche_calcule : function (decoupe, colonne_jouer, joueur_a_calculer, return_gagner)
			{
				var gain = 0;
				var gain_gagner = 1000;
				
				for(var dcp1 = 0, dcl1 = decoupe.length; dcp1 < dcl1; dcp1++)
				{
					//----------------------------------------------
					// analyse d'une ligne
					//----------------------------------------------
					var suite = this.ligne_analyse(decoupe[dcp1], colonne_jouer, joueur_a_calculer);

					//----------------------------------------------
					// calcule d'une ligne
					//----------------------------------------------
					if(suite[2] >= 4)
					{						
						return (return_gagner) ? true : gain_gagner; //gagner
					}
					gain += this.ligne_gain(suite);
				}
				//----------------------------------------------
				// finalisation
				//----------------------------------------------
				return (return_gagner) ? false : gain;
			},

			//----------------------------------------------
			// Analyse d'une ligne (emplacement prit, vide, ...)
			//----------------------------------------------
			ligne_analyse : function (ligne, colonne_jouer, joueur_a_calculer)
			{
				var suite = [
				
					0,		//suite	[0] = G		prit par le joueur_a_calculer, à gauche (pas adjacent à C car séparé par LG)
					0,		//		[1] = LG	libre à gauche
					1,		//		[2] = C		prit par le joueur_a_calculer, adjacent à l'emplacement joué
					0,		//		[3] = LD	libre à droite
					0		//		[4] = D		prit par le joueur_a_calculer, à droite (pas adjacent à C, séparé par LD)
				];
				var key_colonne_jouer = ligne[0];
				
				//----------------------------------------------
				//parcourt les cases APRES l'emplacement joué
				//----------------------------------------------
				var key_switch = true;
				
				for(var cp1 = key_colonne_jouer, cl1 = ligne.length; cp1 < cl1; cp1++)
				{
				   if(ligne[cp1][1] == joueur_a_calculer)	//au joueur_a_calculer
				   {
						suite[ (key_switch) ? 2 : 4 ]++;
				   }
				   else if(ligne[cp1][1] == false)			//libre
				   {
						suite[3]++;
						key_switch = false;
				   }
				   else {break;}							//à un autre joueur
				}
				//----------------------------------------------
				//parcourt les cases AVANT l'emplacement joué
				//----------------------------------------------
				var key_switch = true;
				
				for(var cp1 = (key_colonne_jouer - 1); cp1 >= 1; cp1--)
				{
				   if(ligne[cp1][1] == joueur_a_calculer)	//au joueur_a_calculer
				   {
						suite[ (key_switch) ? 2 : 0 ]++;
				   }
				   else if(ligne[cp1][1] == false)			//libre
				   {
						suite[1]++;
						key_switch = false;
				   }
				   else {break;}							//à un autre joueur
				}
				return suite;
			},
			
			//----------------------------------------------
			// Calcule des gains d'une ligne
			//----------------------------------------------
			//suite	[0] = G		prit par le joueur_a_calculer, à gauche (pas adjacent à C car séparé par LG)
			//		[1] = LG	libre à gauche
			//		[2] = C		prit par le joueur_a_calculer, adjacent à l'emplacement joué
			//		[3] = LD	libre à droite
			//		[4] = D		prit par le joueur_a_calculer, à droite (pas adjacent à C, séparé par LD)
			//----------------------------------------------
			ligne_gain : function (suite)
			{				
				var gain = 0;
				var suite_tot = suite[2] + suite[0] + suite[4];
				
				if((suite_tot + suite[1] + suite[3]) >= 4)			//suite possible
				{					
					var suite_faite = false;
					
					if((suite[2] + suite[0] + suite[1]) >= 4)		//suite possible à gauche
					{						
						suite_faite = true;
						gain += suite[2] + suite[0];
					}
					if((suite[2] + suite[4] + suite[3]) >= 4) 		//suite possible à droite
					{						
						suite_faite = true;
						gain += suite[2] + suite[4];
					}
					if(!suite_faite)								//suite possible uniquement en utilisant gauche et droite
					{
						gain += (suite_tot <= 4) ? suite_tot : 4;
					}
				}
				return gain;
			}
		}
		
		jz.addev(jz.$("start"), "click", function () {return jz.new_puiss4();});

	}
	window.addevListener ? window.addevListener('load', fn_onload_puiss4, false) :
	window.attachEvent ? window.attachEvent('onload', fn_onload_puiss4) : window['onload'] = fn_onload_puiss4;
})();