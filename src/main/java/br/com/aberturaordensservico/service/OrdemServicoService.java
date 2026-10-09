package br.com.aberturaordensservico.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.aberturaordensservico.dto.OrdemServicoRequest;
import br.com.aberturaordensservico.model.Equipamento;
import br.com.aberturaordensservico.model.OrdemServico;
import br.com.aberturaordensservico.repository.EquipamentoRepository;
import br.com.aberturaordensservico.repository.OrdemServicoRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class OrdemServicoService {
    
    OrdemServicoRepository ordemServicoRepository;
    EquipamentoRepository equipamentoRepository;
    
    public Optional<OrdemServico> cadastrarOrdemServico(OrdemServicoRequest ordemServicoRequest) {
        Optional<Equipamento> equipamentoEncontrado = equipamentoRepository.findById(ordemServicoRequest.getEquipamentoId());

        if (equipamentoEncontrado.isEmpty()){
            return Optional.empty();
        }

        OrdemServico ordemServico = new OrdemServico();

        ordemServico.setDescricao(ordemServicoRequest.getDescricao());
        ordemServico.setDataAbertura(LocalDateTime.now());
        ordemServico.setEquipamento(equipamentoEncontrado.get());

        return Optional.of(ordemServicoRepository.save(ordemServico));
    }

    public Optional<OrdemServico> buscarOrdemServicoPorId(Long id) {
        return ordemServicoRepository.findById(id);
    }

    public List<OrdemServico> listarOrdensServico() {
        return ordemServicoRepository.findAll();
    }
}
